import React, { useState } from 'react';
import { Settings as SettingsType } from '@/src/types';
import { Bell, Volume2, Trash2, Download, Share2, Shield, Music, Moon, Plus, X, Settings2, Clock } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  updateSettings: (settings: Partial<SettingsType>) => void;
  onResetData: () => void;
  onExport: (format: 'json' | 'csv') => void;
  onOpenSocialCard: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  updateSettings,
  onResetData,
  onExport,
  onOpenSocialCard,
}) => {
  const [newApp, setNewApp] = useState('');
  const [newSite, setNewSite] = useState('');

  const addApp = () => {
    if (newApp.trim() && !(settings.blockedApps || []).includes(newApp.trim())) {
      updateSettings({ blockedApps: [...(settings.blockedApps || []), newApp.trim()] });
      setNewApp('');
    }
  };

  const addSite = () => {
    if (newSite.trim() && !(settings.blockedWebsites || []).includes(newSite.trim())) {
      updateSettings({ blockedWebsites: [...(settings.blockedWebsites || []), newSite.trim()] });
      setNewSite('');
    }
  };

  return (
    <div className="space-y-8 p-2 overflow-y-auto max-h-full pb-10">
      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#E5E5E5] dark:border-white/10">
        <div className="flex items-center gap-3">
          <Settings2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="font-medium text-[#0D0D0D] dark:text-white">Notifications</div>
                <div className="text-xs text-[#6E6E80] dark:text-white/50">Get alerts for session starts and ends</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="w-10 h-5 rounded-full appearance-none bg-black/10 dark:bg-white/10 checked:bg-primary relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-[#0D0D0D] dark:text-white">Sound Alerts</div>
                <div className="text-xs text-[#6E6E80] dark:text-white/50">Play a sound when timer finishes</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => updateSettings({ sound: e.target.checked })}
              className="w-10 h-5 rounded-full appearance-none bg-black/10 dark:bg-white/10 checked:bg-primary relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="font-medium text-[#0D0D0D] dark:text-white">Auto Do Not Disturb</div>
                <div className="text-xs text-[#6E6E80] dark:text-white/50">Enable DND during focus sessions</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoDND}
              onChange={(e) => updateSettings({ autoDND: e.target.checked })}
              className="w-10 h-5 rounded-full appearance-none bg-black/10 dark:bg-white/10 checked:bg-primary relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Music className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium text-[#0D0D0D] dark:text-white">Background Music</div>
                <div className="text-xs text-[#6E6E80] dark:text-white/50">Play lo-fi beats during focus</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.backgroundMusic}
              onChange={(e) => updateSettings({ backgroundMusic: e.target.checked })}
              className="w-10 h-5 rounded-full appearance-none bg-black/10 dark:bg-white/10 checked:bg-primary relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#E5E5E5] dark:border-white/10">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">Custom Timer</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#6E6E80] dark:text-white/40 uppercase tracking-wider">Focus Duration (min)</label>
            <input
              type="number"
              value={settings.customFocusDuration}
              onChange={(e) => updateSettings({ customFocusDuration: parseInt(e.target.value) || 25 })}
              className="w-full bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl px-4 py-2 outline-none text-[#0D0D0D] dark:text-white font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#6E6E80] dark:text-white/40 uppercase tracking-wider">Break Duration (min)</label>
            <input
              type="number"
              value={settings.customBreakDuration}
              onChange={(e) => updateSettings({ customBreakDuration: parseInt(e.target.value) || 5 })}
              className="w-full bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl px-4 py-2 outline-none text-[#0D0D0D] dark:text-white font-bold"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#E5E5E5] dark:border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">Distraction Blocking</h3>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#6E6E80] dark:text-white/40 uppercase tracking-wider">Blocked Apps (Windows Processes)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newApp}
                onChange={(e) => setNewApp(e.target.value)}
                placeholder="e.g., chrome.exe, discord.exe"
                className="flex-1 bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl px-4 py-2 outline-none text-[#0D0D0D] dark:text-white"
              />
              <button onClick={addApp} className="p-2 bg-primary text-white rounded-xl"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(settings.blockedApps || []).map(app => (
                <div key={app} className="flex items-center gap-2 bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 px-3 py-1 rounded-lg text-xs font-medium text-[#0D0D0D] dark:text-white">
                  {app}
                  <button onClick={() => updateSettings({ blockedApps: (settings.blockedApps || []).filter(a => a !== app) })}><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#6E6E80] dark:text-white/40 uppercase tracking-wider">Blocked Websites</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                placeholder="e.g., youtube.com, twitter.com"
                className="flex-1 bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl px-4 py-2 outline-none text-[#0D0D0D] dark:text-white"
              />
              <button onClick={addSite} className="p-2 bg-primary text-white rounded-xl"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(settings.blockedWebsites || []).map(site => (
                <div key={site} className="flex items-center gap-2 bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 px-3 py-1 rounded-lg text-xs font-medium text-[#0D0D0D] dark:text-white">
                  {site}
                  <button onClick={() => updateSettings({ blockedWebsites: (settings.blockedWebsites || []).filter(s => s !== site) })}><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#E5E5E5] dark:border-white/10">
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">Social & Sharing</h3>
        </div>
        <button
          onClick={onOpenSocialCard}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-primary">
            <Share2 className="w-5 h-5" />
            <span className="font-bold">Share Achievement Card</span>
          </div>
          <Plus className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100" />
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#E5E5E5] dark:border-white/10">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">Data Management</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onExport('json')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#0D0D0D] dark:text-white"
          >
            <Download className="w-5 h-5 text-primary" />
            <span className="font-medium">Export as JSON</span>
          </button>
          
          <button
            onClick={() => onExport('csv')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#0D0D0D] dark:text-white"
          >
            <Share2 className="w-5 h-5 text-secondary" />
            <span className="font-medium">Export as CSV</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors mt-2"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Reset All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
