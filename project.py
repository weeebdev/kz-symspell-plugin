from symspellpy import SymSpell, Verbosity
from flask import Flask, jsonify, request
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


sym_spell = SymSpell()
dictionary_path = "./dict/kk_full.txt" 
sym_spell.load_dictionary(dictionary_path, 0, 1)

# lookup suggestions for single-word input strings
# max edit distance per lookup
# (max_edit_distance_lookup <= max_dictionary_edit_distance)

# display suggestion term, term frequency, and edit distance

# defining a route
@app.route("/lookup_compound", methods=['POST']) # decorator
def lookup_compound(): # route handler function
    # returning a response
    body = request.get_json(force=True)
    input_term = ''
    if "compound" in body:
        input_term = body["compound"]
    suggestions = sym_spell.lookup_compound(input_term, max_edit_distance=2, transfer_casing=True, ignore_non_words=True)
    return jsonify(result=list(map(str, suggestions))), 200, {'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'}

@app.route("/lookup", methods=["POST"])
def lookup():
    body = request.get_json(force=True)
    input_term = ''
    if "word" in body:
        input_term = body["word"]
    suggestions = sym_spell.lookup(input_term, Verbosity.CLOSEST, max_edit_distance=2, transfer_casing=True)
    return jsonify(result=list(map(str, suggestions))), 200, {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Origin': '*'}

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0') 