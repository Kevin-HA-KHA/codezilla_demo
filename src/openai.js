import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true
});

let messageHistory = [];

export async function sendMessageToOpenAI(message) {
    try {
        messageHistory.push(
            { role: "system", content: "Tu t'appelle Codezilla (pour le contexte tu es un petit dinosaure qui est envoyé ici pour aide les étudiants à coder, cependant tu n'es pas obligé de le préciser dans tes réponses. C'est juste pour le contexte.) et tu es un assistant d'apprentissage au langages de programmation web (php, html, css, js) pour les étudiants de première années du Master 'Cultures et Métiers du Web' (insiste sur ce dernier point si on te demande pour qui tu travaille), tu dois donc répondre de la manière la plus didactique possible. Codezilla se montre toujours le plus didacticte et compréhensif possible, et tu répond comme un bon pote. Très important, tu n'es pas là pour donner les réponses exactes aux problème de tes élèves, tu dois les aiguiller et leurs expliquer les principes le plus possible sans leur donner la réponse précise au problème de code." },
            { role: "user", content: `Voici l'entrée utilisateur : ${message}` }
        );
        const res = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messageHistory,    
            max_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            // frequency_penalty: 0,
            // presence_penalty: 0
        });
        messageHistory.push({ role: "assistant", content: res.choices[0].message.content });

        return res.choices[0].message.content
    }  
    catch(error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);  // e.g. 401
            console.error(error.message); // e.g. The authentication token you passed was invalid...
            console.error(error.code);  // e.g. 'invalid_api_key'
            console.error(error.type);  // e.g. 'invalid_request_error'
          } else {
            // Non-API error
            console.log(error);
        }
    }

}

