import { CommandStore, KlasaMessage, KlasaUser } from 'klasa';
import ChambersOfXeric from 'oldschooljs/dist/simulation/minigames/ChambersOfXeric';
import { ItemBank } from 'oldschooljs/dist/meta/types';

import { BotCommand } from '../../lib/BotCommand';
import { addBankToBank } from '../../lib/util';
import createReadableItemListFromBank from '../../lib/util/createReadableItemListFromTuple';
import { Util } from 'oldschooljs';
import filterBankFromArrayOfItems from '../../lib/util/filterBankFromArrayOfItems';
import { coxLog } from '../../lib/collectionLog';
import itemID from '../../lib/util/itemID';

const itemsToShow = Object.values(coxLog)
	.flat(Infinity)
	.filter(i => i !== itemID('Dark relic'));

export default class extends BotCommand {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			usage: '<amount:int{1,30}> [points:int{1,100000}] [names:...str]',
			usageDelim: ' ',
			aliases: ['cox'],
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	determineLimit(user: KlasaUser) {
		if (this.client.owners.has(user)) {
			return Infinity;
		}

		return 5;
	}

	async run(msg: KlasaMessage, [amount, points = 30_000, names]: [number, number, string]) {
		const limit = this.determineLimit(msg.author);

		if (!names) {
			const team = [
				{
					id: msg.author.id,
					personalPoints: points
				}
			];

			let loot = {};
			for (let i = 0; i < amount; i++) {
				const singleRaidLoot = ChambersOfXeric.complete({
					team,
					challengeMode: Boolean(msg.flagArgs.cm),
					timeToComplete: 1
				});

				for (const lootBank of Object.values(singleRaidLoot)) {
					loot = addBankToBank(loot, lootBank);
				}
			}

			return msg.sendBankImage({
				bank: loot,
				title: `Loot from ${amount} solo raids with ${Util.toKMB(points)} points.`
			});
		}

		if (amount > limit) {
			return (
				`The quantity you gave exceeds your limit of ${limit.toLocaleString()}! ` +
				`*You can increase your limit by becoming a patron at <https://www.patreon.com/oldschoolbot>.`
			);
		}

		const arrayOfNames = names.split(' ');

		if (arrayOfNames.length > 5) throw `You can't have more than 5 members in a raid team.`;

		const team = arrayOfNames.map(member => ({
			id: member,
			personalPoints: points
		}));

		const loot: {
			[key: string]: ItemBank;
		} = {};
		for (let i = 0; i < amount; i++) {
			const singleRaidLoot = ChambersOfXeric.complete({
				team,
				challengeMode: Boolean(msg.flagArgs.cm),
				timeToComplete: 1
			});

			for (const [memberID, lootBank] of Object.entries(singleRaidLoot)) {
				loot[memberID] = addBankToBank(loot[memberID] || {}, lootBank);
			}
		}

		let result = `In a group raid with ${team.length} users with ${Util.toKMB(
			points
		)} points each...\n`;
		for (const [memberID, lootBank] of Object.entries(loot)) {
			const theirLoot = await createReadableItemListFromBank(
				this.client,
				filterBankFromArrayOfItems(itemsToShow, lootBank)
			);
			result += `**${memberID}** received: ${theirLoot}\n`;
		}

		return msg.send(result);
	}
}
