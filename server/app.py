from flask import Flask, request, send_file
from ImgCompression import process_image 
import io

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the image processing application. Upload an image to get started."

@app.route('/process', methods=['POST'])
def process():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    if file:
        processed_image = process_image(file)
        img_io = io.BytesIO()
        processed_image.save(img_io, 'JPEG', quality=70)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')
    
@app.route('/download')
def download():
    return send_file('processed_image.jpg', as_attachment=True)

@app.errorhandler(404)
def page_not_found(error):
    return "404 Error: Page not found", 404

@app.errorhandler(500)
def internal_server_error(error):
    return "500 Error: Internal server error", 500


if __name__ == '__main__':
    app.run(debug=True)