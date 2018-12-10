import json, os.path
#setting config file path
my_path = os.path.dirname(__file__)
config_path = os.path.join(my_path, 'config/bot_config.json')


def get_next_bot(config):
	max_bot = max(bot['bot_id'] for bot in config['bots'])
	next_bot = int(max_bot) + 1
	return next_bot


def update_bot(bot_list,new_bot):
	for bot in bot_list['bots']:
		if bot['bot_id'] == new_bot['bot_id']:
			bot.update(new_bot)
	return bot_list

def add_bot(bot_list,new_bot):
	bot_list['bots'].append(new_bot)
	return bot_list

def delete_bot(bot_list,bot_id):
	bots = {}
	bots['bots'] = [bot for bot in bot_list['bots'] if not bot['bot_id'] == bot_id]
	return bots

def load_bot(bot_list,bot_id):
	rtn_bot = {}
	rtn_bot = [bot for bot in bot_list['bots'] if bot['bot_id'] == bot_id]
	return rtn_bot

def test_load(bot_id):
	with open(config_path) as config_json:
		config = json.load(config_json)

	rtn_bot = {}
	rtn_bot = [bot for bot in config['bots'] if bot['bot_id'] == bot_id]
	return rtn_bot