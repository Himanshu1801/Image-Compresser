import base64
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from ImgCompression import process_image 
import io

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Welcome to the image processing application. Upload an image to get started."

@app.route('/process', methods=['POST'])
def process():
    if 'file' not in request.files:
        return jsonify({'error': "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': "No selected file"}), 400
    
    processed_image, error = process_image(file)
    if error:
        return jsonify({'error': error}), 500
    
    with open('processed_image.jpg', 'wb') as f:
        f.write(processed_image)
    
    processed_image_base64 = base64.b64encode(processed_image).decode('utf-8')
    
    return jsonify({'image': processed_image_base64})

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