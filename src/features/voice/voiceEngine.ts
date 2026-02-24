import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const VOICE_TASK = 'somni-voice-command-task';

TaskManager.defineTask(VOICE_TASK, async () => {
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerVoiceBackgroundTask(): Promise<void> {
  await BackgroundFetch.registerTaskAsync(VOICE_TASK, {
    minimumInterval: 60,
    stopOnTerminate: false,
    startOnBoot: true
  });
}

export async function processVoiceCommand(command: string): Promise<string> {
  const normalized = command.toLowerCase();

  if (normalized.includes('sos')) {
    return 'sos';
  }

  if (normalized.includes('sleep')) {
    return 'sleepDiary';
  }

  return 'main';
}
