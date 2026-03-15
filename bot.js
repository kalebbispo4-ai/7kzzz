const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Página que vai aparecer no seu Chrome
app.get('/', (req, res) => {
    res.send(`
        <body style="background: #1a1a1a; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="background: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #7289da;">
                <h2>⛓️ Painel Coleira CSS</h2>
                <form action="/ligar" method="POST">
                    <p>Seu Token:</p>
                    <input type="text" name="token" style="width: 300px;"><br>
                    <p>ID de quem manda (Dono):</p>
                    <input type="text" name="donoId"><br>
                    <p>ID de quem obedece (Coleira):</p>
                    <input type="text" name="alvoId"><br><br>
                    <button type="submit" style="background: #7289da; color: white; border: none; padding: 10px 20px; cursor: pointer;">LIGAR COLEIRA</button>
                </form>
            </div>
        </body>
    `);
});

app.post('/ligar', async (req, res) => {
    const { token, donoId, alvoId } = req.body;
    const client = new Client({ checkUpdate: false });

    try {
        await client.login(token);
        res.send("<h1>✅ Coleira Ativada! Pode fechar esta aba e olhar o console.</h1>");
        
        console.log(`⛓️ Coleira ligada! ${client.user.tag} monitorando...`);

        client.on('voiceStateUpdate', async (oldState, newState) => {
            // Se a pessoa da coleira (alvoId) mudar de sala
            if (newState.id === alvoId) {
                const memberDono = newState.guild.members.cache.get(donoId);
                
                // Se o dono estiver em uma call e o alvo mudar ou entrar em uma diferente
                if (memberDono && memberDono.voice.channelId) {
                    if (newState.channelId !== memberDono.voice.channelId) {
                        console.log(`[!] Puxando ${newState.member.user.username} para a call do dono.`);
                        await newState.setChannel(memberDono.voice.channelId).catch(() => {
                            console.log("❌ Erro ao puxar: Sem permissão de 'Mover Membros'.");
                        });
                    }
                }
            }
        });

    } catch (e) {
        res.send("<h1>❌ Erro ao logar! Token inválido.</h1>");
    }
});

app.listen(port, () => {
    console.log(`🌐 Painel aberto! Digite no Chrome: http://localhost:${port}`);
});