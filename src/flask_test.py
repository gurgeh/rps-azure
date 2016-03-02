from flask import Flask
app = Flask(__name__)

MESSAGE = "Hello World!"


@app.route("/")
def hello():
    return MESSAGE


if __name__ == "__main__":
    app.run()
