from flask import Flask, jsonify, request, render_template
import flask
from flask_cors import CORS 
import google.generativeai as gemini

app = Flask(__name__)

CORS(app)

gemini.configure(api_key="Coloque a sua chave aqui")

model = gemini.GenerativeModel('gemini-1.5-flash')

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/receita', methods=['POST'])
def make_receita():
    try:
        dados = request.json
        if not dados or 'ingredientes' not in dados:
            return jsonify({"Erro": "Dados inválidos. Produtos não fornecidos."}), 400

        ingredientes = dados.get('ingredientes')

        if not isinstance(ingredientes, list) or len(ingredientes) < 3:
            return jsonify({"Erro": "A lista de produtos deve conter pelo menos três itens."}), 400

        prompt = f"""
        Crie uma receita somente com os seguintes ingredientes: {ingredientes}.
        Apresente o cronograma capilar no formato html com codificação UTF-8, sem a sessão <head>, sem as tags <body> e </body>, sem (opicional),
        com o título em h1, subtítulos em h2, tempo de uso dos produtos em parágrafo, 
        não realizar realisar o cronograma se os produtos não derem para ser utilizados no cabelo, 
        criar o cronograma apenas com os produtos que o usuario indicar que tem, 
        escreva em qual dia da semana o usuario deve realizar cada etapa do cronograma,
        crie o cronograma para apenas quatro dias variados da semana,
        nos dias que for utilizar mascara ou ampola de vitaminas a coloque entes do condicionador,
        sugira em algum dia misturar a mascara capilar mais a ampola de vitaminas,
        não gerar o cronograma se houver comida nos produtos,
        ordem de uso de cada produto em lista ordenada, ordene a sugestão de novos produtos em lista.
        Retirar a ```html da primeira linha.
        """ 

        resposta = model.generate_content(prompt)
        if resposta.parts:
            receita = resposta.parts[0].text.strip().strip('\n')
            return (receita)

        return jsonify({"Erro": "Não foi possível gerar o cronograma."}), 500

    except (KeyError, TypeError, ValueError) as e:
        return jsonify({"Erro": "Erro nos dados de entrada."}), 400

    except Exception as e:
        return jsonify({"Erro": str(e)}), 500

if __name__ =='__main__':
    app.run(debug=True)


