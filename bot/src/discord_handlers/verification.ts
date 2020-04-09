/**
 * Verification related handlers.
 */

import { Message } from "discord.js";
import { createVerification, APIError, APIErrorMessages } from '../services/api';


/**
 * Starts the verification process for a user. Firstly, checks if they are not a bot,
 * and then sends a DM with a link to start the verification process.
 * @param arg empty
 * @param ctx message context
 */
export async function initFromGuild(arg: string, ctx: Message): Promise<void> {
    // Only respond to requests within guilds
    if (!ctx.guild) return;
    try {
        const data = await createVerification(ctx.author.id, ctx.guild.id);

        // Thumbs up react
        ctx.react('\uD83D\uDC4D');
        ctx.author.send(`Hi, you have requested ARC verification for ${ctx.guild.name}. ` + 
            'The server owner has requested that you complete this form before ' +
            'a verified role will be granted.\n\n' + `Expires on: ${new Date(data.expires * 1000)}\n` +  data.url);
        
        return;
    } catch(e) {
        if (e instanceof APIError) {
            if (e.message === APIErrorMessages.BannedVerification.toString()) {
                ctx.react('\uD83D\uDC4D');
                ctx.author.send('Hi, the server owner has banned you from ' + 
                    'participating on this server. Please contact them to resolve ' + 
                    'this issue.');
            } else if (e.message === APIErrorMessages.AlreadyVerified.toString()) {
                return;
            }
        }
        throw e;
    }

}
initFromGuild.help = {
    guild: 'initiates your verification process for this server'
}