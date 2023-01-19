const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Agrega a alguien al ticket')
    .addUserOption(input => 
      input.setName('user')
      .setDescription('El usuario para agregar')
      .setRequired(true)),
	async execute(interaction, client) {
    const added = interaction.options.getUser('user');
    const ticket = await client.db.get(`tickets_${interaction.channel.id}`);
    if (!ticket) return interaction.reply({content: 'ticket no encontrado', ephemeral: true}).catch(e => console.log(e));
    if (ticket.invited.includes(added.id)) return interaction.reply({content: 'El usuario ya agregado', ephemeral: true}).catch(e => console.log(e));

    if (ticket.invited.lenght >= 25) return interaction.reply({content: 'No puede agregar más de 25 usuarios', ephemeral: true}).catch(e => console.log(e));

    client.db.push(`tickets_${interaction.channel.id}.invited`, added.id);

    await interaction.channel.permissionOverwrites.edit(added, {
      SendMessages: true,
      AddReactions: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      ViewChannel: true,
    }).catch(e => console.log(e));

    interaction.reply({content: `> Agregado <@${added.id}> al ticket`}).catch(e => console.log(e));

    client.log("userAdded", {
      user: {
        tag: interaction.user.tag,
        id: interaction.user.id,
        avatarURL: interaction.user.displayAvatarURL()
      },
      ticketId: ticket.id,
      ticketChannelId: interaction.channel.id,
      added: {
        id: added.id,
      }
    }, client);
	},
};