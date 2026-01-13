import * as path from 'path';
import * as os from 'os';

export const CONFIG_DIR: string = path.join(os.homedir(), '.cmdgenie');
export const CONFIG_FILE: string = path.join(CONFIG_DIR, 'config.json');
