import { Activity, Tasks } from '../constants';

export function taskNameFromType(activityType: Activity) {
	switch (activityType) {
		case Activity.Agility:
			return Tasks.AgilityActivity;
		case Activity.ClueCompletion:
			return Tasks.ClueActivity;
		case Activity.Cooking:
			return Tasks.CookingActivity;
		case Activity.MonsterKilling:
			return Tasks.MonsterActivity;
		case Activity.Fishing:
			return Tasks.FishingActivity;
		case Activity.Mining:
			return Tasks.MiningActivity;
		case Activity.Smelting:
			return Tasks.SmeltingActivity;
		case Activity.Smithing:
			return Tasks.SmithingActivity;
		case Activity.Woodcutting:
			return Tasks.WoodcuttingActivity;
		case Activity.Firemaking:
			return Tasks.FiremakingActivity;
		case Activity.Crafting:
			return Tasks.CraftingActivity;
		case Activity.Questing:
			return Tasks.QuestingActivity;
		case Activity.Runecraft:
			return Tasks.RunecraftActivity;
	}
}
