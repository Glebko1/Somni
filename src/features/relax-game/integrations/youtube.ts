import { YoutubeAmbientPreset } from '../types';

export type YoutubeAmbientGateway = {
  getPresets: () => Promise<YoutubeAmbientPreset[]>;
  playPreset: (presetId: string) => Promise<void>;
};

export const youtubeAmbientGatewayStub: YoutubeAmbientGateway = {
  async getPresets() {
    return [
      { id: 'future-rain', title: 'Rain Focus Flow' },
      { id: 'future-lofi', title: 'Lofi Sleep Drift' }
    ];
  },
  async playPreset() {
    // Stage 5: reserved for future YouTube integration without coupling UI to provider APIs.
  }
};
