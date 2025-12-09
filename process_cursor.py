
from PIL import Image, ImageOps, ImageFilter
import os

def process_cursor():
    input_path = "public/cursor.png"
    output_path = "public/cursor-v4.png"
    
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Previous was 25 degrees (CCW). User wants "slightly to the right" (Clockwise).
        # So we reduce the CCW angle. Let's try 10 degrees.
        img_rotated = img.rotate(10, expand=True, resample=Image.Resampling.BICUBIC)
        
        # Resize - User wants "a lil bit bigger". Previous was 24. Let's go to 32.
        target_height = 32
        aspect_ratio = img_rotated.width / img_rotated.height
        target_width = int(target_height * aspect_ratio)
        img_small = img_rotated.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Find the bounding box of the non-transparent area to identify the "tip"
        bbox = img_small.getbbox()
        if not bbox:
            print("Image is empty!")
            return
            
        # Crop to the content so we can position the tip accurately
        img_cropped = img_small.crop(bbox)
        
        # Create a new canvas with padding for the border
        # We want to position the "tip" (top-left of content) at (1,1)
        canvas_w = img_cropped.width + 4
        canvas_h = img_cropped.height + 4
        
        final_img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        
        # Create image with padding for border processing
        padded = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        padded.paste(img_cropped, (1, 1))
        
        # Extract alpha for mask
        a = padded.split()[3]
        
        # Create dilated mask (3x3 max filter) for border
        dilated = a.filter(ImageFilter.MaxFilter(3))
        
        # Create black border layer
        border_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 255))
        border_layer.putalpha(dilated)
        
        # Composite: Border first, then original image
        final_img.paste(border_layer, (0, 0), border_layer)
        final_img.paste(padded, (0, 0), padded)
        
        final_img.save(output_path)
        print(f"Successfully processed rotated cursor to {output_path}")

    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    process_cursor()
