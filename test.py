from flask import Flask, render_template, request, jsonify
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# Setting up the chatbot model and template
template = """
Trả lời câu hỏi phía dưới

Đây là đoạn chat: {context}

Câu hỏi: {question}

Chatbot: 
"""
model = OllamaLLM(model="llama3")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

app = Flask(__name__)

# API endpoint for handling chat
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    context = data.get('context', '')
    user_input = data['question']

    # Get chatbot response
    result = chain.invoke({"context": context, "question": user_input})

    # Update context with user input and chatbot response
    context += f"\nYou: {user_input} \nChatbot: {result}"

    return jsonify({'response': result, 'context': context})

# Home route for frontend
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
