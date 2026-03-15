const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Rota para abrir o site no Chrome
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota que recebe os dados do formulário
app.post('/ligar', async (req, res) => {
    const { token, donoId, alvoId } = req.body;
    const client = new Client({ checkUpdate: false });

    try {
        await client.login(token);
        console.log(`\n[OK] Coleira ativada na conta: ${client.user.tag}`);
        console.log(`[!] Monitorando Alvo: ${alvoId} | Dono: ${donoId}`);
        
        res.send(`
            <body style="background: #202225; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
                <div style="text-align: center; border: 2px solid #3ba55d; padding: 20px; border-radius: 10px;">
                    <h1 style="color: #3ba55d;">✅ COLEIRA ATIVA!</h1>
                    <p>O bot está rodando no console. Pode minimizar o Chrome.</p>
                    <button onclick="window.location.href='/'" style="background: #5865f2; color: white; border: none; padding: 10px; cursor: pointer; border-radius: 5px;">Voltar</button>
                </div>
            </body>
        `);

        // Lógica da Coleira (Puxar)
        client.on('voiceStateUpdate', async (oldState, newState) => {
            // Se o alvo mudar de sala ou entrar em uma nova
            if (newState.id === alvoId) {
                const guild = newState.guild;
                const memberDono = guild.members.cache.get(donoId);

                if (memberDono && memberDono.voice.channelId) {
                    // Se o alvo não estiver na mesma sala que o dono
                    if (newState.channelId !== memberDono.voice.channelId) {
                        try {
                            await newState.setChannel(memberDono.voice.channelId);
                            console.log(`[⛓️] Alvo puxado para a sala do dono com sucesso.`);
                        } catch (err) {
                            console.log(`[❌] Erro ao puxar: Verifique se sua conta tem permissão de 'Mover Membros'.`);
                        }
                    }
                }
            }
        });

    } catch (e) {
        res.send("<h1>❌ Erro: Token Inválido ou Falha na Conexão.</h1>");
    }
});

app.listen(port, () => {
    console.clear();
    console.log(`
    ================================================
    🌐 PAINEL COLEIRA CSS ATIVO
    ➤ Abra o Chrome e digite: http://localhost:3000
    ================================================
    `);
});