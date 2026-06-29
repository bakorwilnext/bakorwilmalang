'use client'

import React from 'react'
import { useAccessibility } from '@/providers/Accessibility'
import { X, RefreshCw, Accessibility, Type, Eye, MousePointer, AlignLeft } from 'lucide-react'
import './accessibility.css'

export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSetting, resetSettings, isPanelOpen, togglePanel } = useAccessibility()

  if (!isPanelOpen) {
    return (
      <button
        onClick={togglePanel}
        className="fixed bottom-6 left-6 z-[9999] p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50"
        aria-label="Open Accessibility Settings"
        title="Accessibility Settings"
      >
        <Accessibility className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9999] w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-card border-2 border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">                   
      <div className="flex items-center justify-between p-4 border-b-2 border-border bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Accessibility className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-bold text-lg text-foreground">Accessibility</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={resetSettings}
            className="p-2.5 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
            aria-label="Reset settings"
            title="Reset all settings"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button
            onClick={togglePanel}
            className="p-2.5 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>                     
      <div className="overflow-y-auto flex-1 p-5 space-y-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">                        
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <label className="font-semibold text-sm text-foreground">Text Size</label>
            </div>
            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              {settings.fontSize}%
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="150"
            step="5"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
            className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>80%</span>
            <span>100%</span>
            <span>150%</span>
          </div>
        </section>
                              
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-foreground">Letter Spacing</label>
            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              {settings.letterSpacing}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={settings.letterSpacing}
            onChange={(e) => updateSetting('letterSpacing', Number(e.target.value))}
            className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer slider-thumb"
          />
        </section>
                           
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-foreground">Line Height</label>
            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              {settings.lineHeight.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="1.2"
            max="2.5"
            step="0.1"
            value={settings.lineHeight}
            onChange={(e) => updateSetting('lineHeight', Number(e.target.value))}
            className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer slider-thumb"
          />
        </section>

        <div className="border-t border-border pt-4"></div>

                                  
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Visual Adjustments</h3>
          </div>
          <div className="space-y-2">
            <ToggleOption
              label="High Contrast"
              checked={settings.highContrast}
              onChange={(checked) => updateSetting('highContrast', checked)}
            />
            <ToggleOption
              label="Grayscale"
              checked={settings.grayscale}
              onChange={(checked) => updateSetting('grayscale', checked)}
            />
            <ToggleOption
              label="Invert Colors"
              checked={settings.invertColors}
              onChange={(checked) => updateSetting('invertColors', checked)}
            />
            <ToggleOption
              label="Hide Images"
              checked={settings.hideImages}
              onChange={(checked) => updateSetting('hideImages', checked)}
            />
            <ToggleOption
              label="Highlight Links"
              checked={settings.highlightLinks}
              onChange={(checked) => updateSetting('highlightLinks', checked)}
            />
          </div>
        </section>

        <div className="border-t border-border pt-4"></div>
                            
        <section className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Font Options</h3>
          <ToggleOption
            label="Readable Font"
            description="Dyslexia-friendly font"
            checked={settings.readableFont}
            onChange={(checked) => updateSetting('readableFont', checked)}
          />
        </section>

        <div className="border-t border-border pt-4"></div>
                             
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-primary" />
            <label className="font-semibold text-sm text-foreground">Text Alignment</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['default', 'left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                onClick={() => updateSetting('textAlign', align)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                  settings.textAlign === align
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-background border-border hover:bg-muted hover:border-primary/50'
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border pt-4"></div>
                          
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-primary" />
            <label className="font-semibold text-sm text-foreground">Cursor Size</label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['default', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSetting('cursorSize', size)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                  settings.cursorSize === size
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-background border-border hover:bg-muted hover:border-primary/50'
                }`}
              >
                {size === 'default' ? 'Normal' : size === 'large' ? 'Large' : 'X-Large'}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border pt-4"></div>
                            
        <section className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Reading Aids</h3>
          <div className="space-y-2">
            <ToggleOption
              label="Reading Guide"
              description="Highlight current line"
              checked={settings.readingGuide}
              onChange={(checked) => updateSetting('readingGuide', checked)}
            />
            <ToggleOption
              label="Focus Highlight"
              description="Enhanced focus indicators"
              checked={settings.focusHighlight}
              onChange={(checked) => updateSetting('focusHighlight', checked)}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

const ToggleOption: React.FC<{
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ label, description, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 group border border-transparent hover:border-primary/20">
      <div className="flex-1 pr-3">
        <span className="text-sm font-medium block text-foreground group-hover:text-primary transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground block mt-0.5">{description}</span>
        )}
      </div>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${
            checked ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted-foreground/30'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
              checked ? 'translate-x-5 scale-110' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </label>
  )
}