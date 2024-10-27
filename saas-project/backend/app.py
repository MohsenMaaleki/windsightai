import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
from ultralytics import YOLO
from database import init_db, get_db
from db_models import User, Upload, Analysis, Subscription
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'best.pt')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# Initialize the database
init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_and_save(file_path: str, model_path: str = MODEL_PATH, output_dir: str = OUTPUT_FOLDER) -> str:
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        app.logger.info(f"Loading model from {model_path}")
        model = YOLO(model_path)
    except Exception as e:
        app.logger.error(f"Failed to load model from {model_path}: {e}")
        raise RuntimeError(f"Failed to load model from {model_path}: {e}")
    
    try:
        app.logger.info(f"Running prediction on {file_path}")
        results = model(file_path)
    except Exception as e:
        app.logger.error(f"Prediction failed for file {file_path}: {e}")
        raise RuntimeError(f"Prediction failed for file {file_path}: {e}")
    
    input_path = Path(file_path)
    output_path = output_dir / f"{input_path.stem}_pred{input_path.suffix}"
    
    try:
        app.logger.info(f"Saving prediction result to {output_path}")
        results[0].save(output_path)
    except Exception as e:
        app.logger.error(f"Failed to save prediction result to {output_path}: {e}")
        raise RuntimeError(f"Failed to save prediction result to {output_path}: {e}")
    
    return str(output_path)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    db = next(get_db())
    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=data['hashedPassword']  # In a real app, hash this password
        )
        db.add(new_user)
        db.commit()
        return jsonify({"message": "User registered successfully", "user_id": new_user.id}), 201
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Username or email already exists"}), 400
    finally:
        db.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    app.logger.info(f"Login attempt for username: {data.get('username')}")
    db = next(get_db())
    try:
        user = db.query(User).filter(User.username == data['username']).first()
        if user and user.password_hash == data['hashedPassword']:  # In a real app, verify the hashed password
            user.last_login = datetime.utcnow()
            db.add(user)
            db.commit()
            app.logger.info(f"Login successful for user: {user.username}")
            return jsonify({
                "message": "Login successful",
                "user_id": user.id,
                "username": user.username
            }), 200
        else:
            app.logger.warning(f"Login failed for username: {data['username']}")
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        db.close()

@app.route('/api/upload', methods=['POST'])
def upload_file():
    user_id = request.form.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        db = next(get_db())
        try:
            new_upload = Upload(
                user_id=user_id,
                filename=filename,
                original_path=file_path,
                file_type=file.content_type,
                file_size=os.path.getsize(file_path)
            )
            db.add(new_upload)
            db.commit()
            db.refresh(new_upload)
            
            return jsonify({
                "message": "File uploaded successfully", 
                "filename": filename, 
                "upload_id": new_upload.id
            }), 201
        except Exception as e:
            db.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            db.close()
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/analyze/<int:upload_id>', methods=['POST'])
def analyze_file(upload_id):
    db = next(get_db())
    try:
        upload = db.query(Upload).get(upload_id)
        if not upload:
            app.logger.error(f"Upload not found for ID: {upload_id}")
            return jsonify({"error": "Upload not found"}), 404
        
        file_path = upload.original_path
        if not os.path.exists(file_path):
            app.logger.error(f"File not found at path: {file_path}")
            return jsonify({"error": "File not found"}), 404
        
        try:
            output_path = predict_and_save(file_path)
            app.logger.info(f"Analysis completed for file: {file_path}")
        except Exception as e:
            app.logger.error(f"Error during prediction: {str(e)}")
            return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
        
        relative_output_path = os.path.relpath(output_path, start=app.config['OUTPUT_FOLDER'])
        
        new_analysis = Analysis(
            upload_id=upload_id,
            status='completed',
            result_path=relative_output_path
        )
        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)
        
        return jsonify({
            "message": "File analyzed successfully", 
            "filename": upload.filename,
            "prediction": relative_output_path
        }), 200
    except Exception as e:
        db.rollback()
        app.logger.error(f"Unexpected error in analyze_file: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/uploads', methods=['GET'])
def get_uploads():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    db = next(get_db())
    try:
        uploads = db.query(Upload).filter(Upload.user_id == user_id).all()
        uploads_data = [{
            "id": upload.id,
            "filename": upload.filename,
            "upload_date": upload.upload_date.isoformat(),
            "file_type": upload.file_type,
            "file_size": upload.file_size,
            "analyses": [{
                "id": analysis.id,
                "status": analysis.status,
                "result_path": analysis.result_path
            } for analysis in upload.analyses]
        } for upload in uploads]
        return jsonify(uploads_data)
    finally:
        db.close()

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    db = next(get_db())
    try:
        user = db.query(User).get(data['user_id'])
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if user already has an active subscription
        active_subscription = db.query(Subscription).filter(
            Subscription.user_id == user.id,
            Subscription.status == 'active'
        ).first()

        if active_subscription:
            return jsonify({"error": "User already has an active subscription"}), 400

        # Create new subscription
        new_subscription = Subscription(
            user_id=user.id,
            plan_type=data['plan_type'],
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),  # Assuming 30-day subscription
            status='active'
        )
        db.add(new_subscription)
        db.commit()
        return jsonify({"message": "Subscription created successfully", "subscription_id": new_subscription.id}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/subscription/<int:user_id>', methods=['GET'])
def get_subscription(user_id):
    db = next(get_db())
    try:
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.status == 'active'
        ).first()
        
        if subscription:
            return jsonify({
                "subscription_id": subscription.id,
                "plan_type": subscription.plan_type,
                "start_date": subscription.start_date.isoformat(),
                "end_date": subscription.end_date.isoformat(),
                "status": subscription.status
            })
        else:
            return jsonify({"message": "No active subscription found"}), 404
    finally:
        db.close()

@app.route('/api/cancel_subscription/<int:subscription_id>', methods=['POST'])
def cancel_subscription(subscription_id):
    db = next(get_db())
    try:
        subscription = db.query(Subscription).get(subscription_id)
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404

        subscription.status = 'cancelled'
        subscription.end_date = datetime.utcnow()
        db.commit()
        return jsonify({"message": "Subscription cancelled successfully"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/output/<filename>')
def output_file(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

def init_db():
    db = next(get_db())
    try:
        # Check if any users exist
        user_count = db.query(User).count()
        if user_count == 0:
            # Create a test user
            test_user = User(username='test', email='test@example.com', password_hash='test')
            db.add(test_user)
            db.commit()
            print("Test user created")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
    finally:
        db.close()

# Call this function when your app starts
init_db()

if __name__ == '__main__':
    app.run(debug=True)