from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory

app = Flask(__name__, 
            template_folder='../frontend/templates', 
            static_folder='../frontend/images')
app.secret_key = 'supersecretkey'  # Needed for flash messages

# Dummy data store
users = {}

# Serve images from the images directory
@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['login-password']
        user = users.get(email)
        if user and check_password_hash(user['password'], password):
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials', 'danger')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        email = request.form['email']
        password = request.form['signup-password']
        verify_password = request.form['verify-password']

        if password != verify_password:
            flash('Passwords do not match!', 'danger')
        elif email in users:
            flash('Email already registered!', 'danger')
        else:
            users[email] = {
                'firstname': firstname,
                'lastname': lastname,
                'password': generate_password_hash(password)
            }
            flash('Registration successful!', 'success')
            return redirect(url_for('login'))
    return render_template('sign-up.html')

@app.route('/about-us')
def about_us():
    return render_template('about-us.html')

@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/search-mysterious-flights')
def search_mysterious_flights():
    return render_template('search-mysterious-flights.html')

@app.route('/search-normal-flights')
def search_normal_flights():
    return render_template('search-normal-flights.html')

@app.route('/search-result-mysterious-flight')
def search_result_mysterious_flight():
    return render_template('search-result-mysterious-flight.html')

@app.route('/search-result-normal-flight')
def search_result_normal_flight():
    return render_template('search-result-normal-flight.html')

if __name__ == '__main__':
    app.run(debug=True)

