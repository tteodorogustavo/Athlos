import json
from django.core.management.base import BaseCommand
from treinos.models import Exercicio

class Command(BaseCommand):

    
    def add_arguments(self, parser):
        parser.add_argument(
            'caminho_json', 
            type=str, 
            help='O caminho completo para o arquivo JSON de exercícios'
        )


    def handle(self, *args, **options):
        caminho_arquivo = options['caminho_json']

        self.stdout.write(self.style.SUCCESS(f'Iniciando importação de {caminho_arquivo}'))

        try:
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                dados = json.load(f)
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR('Arquivo não encontrado!'))
            return
        except json.JSONDecodeError:
            self.stderr.write(self.style.ERROR('Erro ao decodificar o JSON.'))
            return

        total_criados = 0
        total_atualizados = 0
        
        
        if not isinstance(dados, list):
            self.stderr.write(self.style.ERROR('O JSON não é uma lista de exercícios.'))
            return
            
        for item in dados:
            

            try:
                exercicio, criado = Exercicio.objects.update_or_create(
                    nome = item.get('name'), 
                    
                    defaults={
                        'slug': item.get('id'),
                        'force': item.get('force'),
                        'level': item.get('level'),
                        'mechanic': item.get('mechanic'),
                        'equipment': item.get('equipment'),
                        'category': item.get('category'),
                        'primary_muscles': item.get('primaryMuscles', []),
                        'secondary_muscles': item.get('secondaryMuscles', []),
                        'instructions': item.get('instructions', []),
                        'images': item.get('images', []),
                    }
                )
                
                if criado:
                    total_criados += 1
                else:
                    total_atualizados += 1

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Erro ao importar '{item.get('name')}': {e}"))

        self.stdout.write(self.style.SUCCESS(
            f'Importação concluída! {total_criados} criados, {total_atualizados} atualizados.'
        ))