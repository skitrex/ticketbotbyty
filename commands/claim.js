const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Establecer el ticket como Reclamado.'),
	async execute(interaction, client) {
    const {claim} = require('../utils/claim.js');
    claim(interaction, client);
	},
};