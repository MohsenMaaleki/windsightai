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
import logging
from logging.handlers import RotatingFileHandler
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')  # Use environment variable for secret key

# CORS configuration
CORS(app, resources={r"/api/*": {"origins": os.environ.get('ALLOWED_ORIGINS', 'https://your-frontend-domain.com')}}, supports_credentials=True)

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')
file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('WindSightAI startup')

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'best.pt')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Password validation regex
PASSWORD_PATTERN = re.compile(
    r'^(?=.*[A-Za-z])'  # At least one letter
    r'(?=.*\d)'         # At least one digit
    r'(?=.*[~`!@#$%^&*()+=\-_{}\[\]|:;"\'<>,.?/])'  # At least one special character
    r'[A-Za-z\d~`!@#$%^&*()+=\-_{}\[\]|:;"\'<>,.?/]{8,}$'  # Valid character set and minimum length
)

# Create necessary folders
for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_password(password: str) -> tuple[bool, str]:
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not PASSWORD_PATTERN.match(password):
        return False, "Password must contain at least one letter, one number, and one special character"
    return True, "Password is valid"

def predict_and_save(file_path: str, model_path: str = MODEL_PATH, output_dir: str = OUTPUT_FOLDER) -> str:
    """Predict using YOLO model and save results"""
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
    """Register a new user"""
    # Validate request data
    data = request.json
    if not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Validate password strength
    is_valid, message = validate_password(data['password'])
    if not is_valid:
        return jsonify({"error": message}), 400

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        return jsonify({"error": "Invalid email format"}), 400

    # Initialize database connection
    db = next(get_db())
    try:
        # Hash the password before storing
        hashed_password = User.hash_password(data['password'])
        
        # Create new user instance
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=hashed_password
        )
        
        # Add and commit to database
        db.add(new_user)
        db.commit()
        
        # Log successful registration
        app.logger.info(f"New user registered: {new_user.username}")
        
        # Return success response
        return jsonify({
            "message": "User registered successfully",
            "user_id": new_user.id
        }), 201
        
    except IntegrityError as e:
        # Handle duplicate username/email
        db.rollback()
        if 'username' in str(e.orig):
            return jsonify({"error": "Username already exists"}), 400
        elif 'email' in str(e.orig):
            return jsonify({"error": "Email already exists"}), 400
        return jsonify({"error": "Username or email already exists"}), 400
        
    except Exception as e:
        # Handle unexpected errors
        db.rollback()
        app.logger.error(f"Registration error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500
        
    finally:
        # Always close the database connection
        db.close()

@app.route('/api/login', methods=['POST'])
def login():
    """Log in a user"""
    data = request.json
    if not all(key in data for key in ['username', 'password']):
        return jsonify({"error": "Missing username or password"}), 400

    app.logger.info(f"Login attempt for username: {data.get('username')}")
    db = next(get_db())
    try:
        user = db.query(User).filter(User.username == data['username']).first()
        if user and user.verify_password(data['password']):
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
    """Upload a file for analysis"""
    user_id = request.form.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        try:
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
                
                app.logger.info(f"File uploaded successfully: {filename} by user {user_id}")
                return jsonify({
                    "message": "File uploaded successfully", 
                    "filename": filename, 
                    "upload_id": new_upload.id
                }), 201
            except Exception as e:
                db.rollback()
                app.logger.error(f"Database error during upload: {str(e)}")
                return jsonify({"error": str(e)}), 500
            finally:
                db.close()
        except Exception as e:
            app.logger.error(f"File saving error: {str(e)}")
            return jsonify({"error": "Error saving file"}), 500
            
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/analyze/<int:upload_id>', methods=['POST'])
def analyze_file(upload_id):
    """Analyze an uploaded file"""
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
    """Get all uploads for a user"""
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
    except Exception as e:
        app.logger.error(f"Error fetching uploads: {str(e)}")
        return jsonify({"error": "Failed to fetch uploads"}), 500
    finally:
        db.close()

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    """Subscribe a user to a plan"""
    data = request.json
    if not data or 'user_id' not in data or 'plan_type' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    db = next(get_db())
    try:
        user = db.query(User).get(data['user_id'])
        if not user:
            return jsonify({"error": "User not found"}), 404

        active_subscription = db.query(Subscription).filter(
            Subscription.user_id == user.id,
            Subscription.status == 'active'
        ).first()

        if active_subscription:
            return jsonify({"error": "User already has an active subscription"}), 400

        new_subscription = Subscription(
            user_id=user.id,
            plan_type=data['plan_type'],
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),
            status='active'
        )
        db.add(new_subscription)
        db.commit()
        
        app.logger.info(f"New subscription created for user {user.id}")
        return jsonify({
            "message": "Subscription created successfully",
            "subscription_id": new_subscription.id
        }), 201
    except Exception as e:
        db.rollback()
        app.logger.error(f"Subscription error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/subscription/<int:user_id>', methods=['GET'])
def get_subscription(user_id):
    """Get active subscription for a user"""
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
    """Cancel a subscription"""
    db = next(get_db())
    try:
        subscription = db.query(Subscription).get(subscription_id)
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404

        subscription.status = 'cancelled'
        subscription.end_date = datetime.utcnow()
        db.commit()
        
        app.logger.info(f"Subscription {subscription_id} cancelled")
        return jsonify({"message": "Subscription cancelled successfully"})
    except Exception as e:
        db.rollback()
        app.logger.error(f"Error cancelling subscription: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/output/<filename>')
def output_file(filename):
    """Serve output files"""
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

def init_db():
    """Initialize database with test user if needed"""
    db = next(get_db())
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            test_password = "TestPass123!"
            test_user = User(
                username='test',
                email='test@example.com',
                password_hash=User.hash_password(test_password)
            )
            db.add(test_user)
            db.commit()
            app.logger.info("Test user created with hashed password")
            print("Test user created with hashed password")
    except Exception as e:
        app.logger.error(f"Error initializing database: {str(e)}")
        print(f"Error initializing database: {str(e)}")
    finally:
        db.close()

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    db = next(get_db())
    db.rollback()
    db.close()
    app.logger.error(f'Server Error: {error}')
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(413)
def too_large(error):
    return jsonify({"error": "File is too large"}), 413

# Initialize the database when the app starts
init_db()

if __name__ == '__main__':
    # Set up logging for production
    if not app.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/windsightai.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('WindSightAI startup')
    
    app.run(host='0.0.0.0', debug=False, ssl_context='adhoc')
