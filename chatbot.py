from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

template = """
Trả lời câu hỏi phía dưới

Đây là đoạn chat: {context}

Câu hỏi: {question}

Chatbot: 
"""
model = OllamaLLM(model = "llama3")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def handle_conversation():
    context = ""
    print("Chào, tôi là AI Chatbot! Nhắn 'exit' để thoát")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        result = chain.invoke({"context": context, "question": user_input})
        print("Chatbot: ", result)
        context += f"\n Anno: {user_input} \n AI: {result}"
        
if __name__ == "__main__":
    handle_conversation()