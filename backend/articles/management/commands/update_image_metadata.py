from django.core.management.base import BaseCommand
from articles.models import Image
from PIL import Image as PILImage
import os


class Command(BaseCommand):
    help = 'Update metadata for existing images (width, height, file_size)'
    
    def handle(self, *args, **options):
        images = Image.objects.filter(width__isnull=True)
        updated_count = 0
        
        for image in images:
            try:
                if image.image and os.path.exists(image.image.path):
                    # Get file size
                    image.file_size = os.path.getsize(image.image.path)
                    
                    # Get image dimensions
                    with PILImage.open(image.image.path) as pil_image:
                        image.width, image.height = pil_image.size
                    
                    image.save(update_fields=['width', 'height', 'file_size'])
                    updated_count += 1
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Updated "{image.title}": {image.width}x{image.height}, {image.file_size / 1024 / 1024:.2f}MB'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'File not found for image: {image.title}')
                    )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error processing {image.title}: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} images')
        )