'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Mic, MessageSquare, Target,
  TrendingUp, Brain, FileText, Send, Clock, MapPin, AlertCircle,
  CheckCircle, ChevronRight, Star, BarChart2, Lightbulb, Edit3
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { fieldCopilotAgent } from '@/lib/agents/field-copilot-agent';
import type { CustomerSuggestion } from '@/lib/agents/field-copilot-agent';

interface FieldCopilotEnhancedProps {
  repId?: string;
  onAction?: (action: string, data: any) => void;
}

export function FieldCopilotEnhanced({ repId = 'REP-001', onAction }: FieldCopilotEnhancedProps) {
  const [activeFeature, setActiveFeature] = useState<'suggestions' | 'email' | 'coaching' | 'schedule' | 'notes'>('suggestions');
  const [selectedHCP, setSelectedHCP] = useState<string>('HCP-001');
  const [qaQuery, setQaQuery] = useState('');
  const [emailDraft, setEmailDraft] = useState<any>(null);
  const [coachingSession, setCoachingSession] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const features = [
    { id: 'suggestions', label: 'Customer Suggestions', icon: Lightbulb, color: zsColors.secondary.orange },
    { id: 'email', label: 'Email Drafting', icon: Mail, color: zsColors.secondary.blue },
    { id: 'coaching', label: 'Virtual Coaching', icon: Brain, color: zsColors.secondary.teal },
    { id: 'schedule', label: 'Call Scheduling', icon: Calendar, color: zsColors.primary.navy },
    { id: 'notes', label: 'Note Recording', icon: Mic, color: zsColors.secondary.purple }
  ];

  const suggestions = fieldCopilotAgent.getCustomerSuggestions(selectedHCP);
  const territoryInsights = fieldCopilotAgent.getTerritoryInsights();

  const handleQASubmit = async () => {
    if (!qaQuery.trim()) return;
    const response = await fieldCopilotAgent.askQuestion(qaQuery, selectedHCP);
    console.log('QA Response:', response);
    setQaQuery('');
  };

  const handleDraftEmail = () => {
    const draft = fieldCopilotAgent.draftEmail(selectedHCP, 'Follow-up');
    setEmailDraft(draft);
  };

  const handleStartCoaching = (difficulty: string) => {
    const session = fieldCopilotAgent.startVirtualCoaching(difficulty);
    setCoachingSession(session);
  };

  const handleScheduleCall = () => {
    const appointment = fieldCopilotAgent.scheduleCall(selectedHCP);
    console.log('Scheduled:', appointment);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    const note = fieldCopilotAgent.recordNote(selectedHCP, noteContent);
    console.log('Note saved:', note);
    setNoteContent('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return zsColors.semantic.error;
      case 'High': return zsColors.secondary.orange;
      case 'Medium': return zsColors.semantic.warning;
      case 'Low': return zsColors.semantic.success;
      default: return zsColors.neutral.gray;
    }
  };

  return (
    <div className="space-y-6">
      {/* Territory Overview Card */}
      <div className="rounded-lg p-6" style={{
        backgroundColor: zsColors.neutral.white,
        border: `1px solid ${zsColors.neutral.lightGray}`
      }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: zsColors.neutral.charcoal }}>
            Territory Performance
          </h3>
          <span className="text-sm px-3 py-1 rounded-full" style={{
            backgroundColor: zsColors.semantic.success + '20',
            color: zsColors.semantic.success
          }}>
            Top 8% Nationally
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg p-4" style={{
            backgroundColor: zsColors.neutral.offWhite,
            border: `1px solid ${zsColors.neutral.lightGray}`
          }}>
            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Total HCPs</p>
            <p className="text-2xl font-bold" style={{ color: zsColors.primary.navy }}>
              {territoryInsights.totalHCPs}
            </p>
            <p className="text-xs mt-1" style={{ color: zsColors.semantic.success }}>
              +12 this quarter
            </p>
          </div>
          <div className="rounded-lg p-4" style={{
            backgroundColor: zsColors.neutral.offWhite,
            border: `1px solid ${zsColors.neutral.lightGray}`
          }}>
            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Calls (QTD)</p>
            <p className="text-2xl font-bold" style={{ color: zsColors.secondary.blue }}>
              {territoryInsights.performance.currentQuarter.calls}
            </p>
            <p className="text-xs mt-1" style={{ color: zsColors.semantic.success }}>
              +7% vs last quarter
            </p>
          </div>
          <div className="rounded-lg p-4" style={{
            backgroundColor: zsColors.neutral.offWhite,
            border: `1px solid ${zsColors.neutral.lightGray}`
          }}>
            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Conversions</p>
            <p className="text-2xl font-bold" style={{ color: zsColors.secondary.teal }}>
              {territoryInsights.performance.currentQuarter.conversions}
            </p>
            <p className="text-xs mt-1" style={{ color: zsColors.semantic.success }}>
              14.9% conversion rate
            </p>
          </div>
          <div className="rounded-lg p-4" style={{
            backgroundColor: zsColors.neutral.offWhite,
            border: `1px solid ${zsColors.neutral.lightGray}`
          }}>
            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Revenue (QTD)</p>
            <p className="text-2xl font-bold" style={{ color: zsColors.semantic.success }}>
              ${(territoryInsights.performance.currentQuarter.revenue / 1e6).toFixed(1)}M
            </p>
            <p className="text-xs mt-1" style={{ color: zsColors.semantic.success }}>
              +15% vs target
            </p>
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="rounded-lg p-6" style={{
        backgroundColor: zsColors.neutral.white,
        border: `1px solid ${zsColors.neutral.lightGray}`
      }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
          Field Copilot Features
        </h3>

        <div className="flex items-center gap-3 mb-6">
          {features.map((feature) => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeFeature === feature.id ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                backgroundColor: activeFeature === feature.id ? feature.color + '15' : zsColors.neutral.offWhite,
                borderColor: activeFeature === feature.id ? feature.color : zsColors.neutral.lightGray,
                borderWidth: '1px',
                borderStyle: 'solid',
                ...(activeFeature === feature.id && { ringColor: feature.color })
              }}
            >
              <feature.icon size={18} style={{ color: feature.color }} />
              <span className="text-sm font-medium" style={{
                color: activeFeature === feature.id ? feature.color : zsColors.neutral.darkGray
              }}>
                {feature.label}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Customer Suggestions & Q&A */}
          {activeFeature === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Q&A Interface */}
              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.offWhite,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <h4 className="font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                  Customer Research Q&A
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qaQuery}
                    onChange={(e) => setQaQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQASubmit()}
                    placeholder="Ask about customer barriers, preferences, history..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`,
                      color: zsColors.neutral.charcoal
                    }}
                  />
                  <button
                    onClick={handleQASubmit}
                    className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{
                      backgroundColor: zsColors.secondary.orange,
                      color: zsColors.neutral.white
                    }}
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['What are their main barriers?', 'Best time to call?', 'Previous objections?'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQaQuery(q)}
                      className="text-xs px-3 py-1 rounded-full transition-colors hover:bg-white"
                      style={{
                        backgroundColor: zsColors.neutral.white,
                        border: `1px solid ${zsColors.neutral.lightGray}`,
                        color: zsColors.neutral.darkGray
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Key Customer Suggestions
                </h4>
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-lg p-4" style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: getPriorityColor(suggestion.priority) }}>
                          {suggestion.priority}
                        </span>
                        <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {suggestion.hcpName}
                        </span>
                        <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          • {suggestion.type}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        {suggestion.timing.urgency}
                      </span>
                    </div>

                    <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                      <strong>Suggestion:</strong> {suggestion.suggestion}
                    </p>
                    <p className="text-xs mb-3" style={{ color: zsColors.neutral.gray }}>
                      <strong>Rationale:</strong> {suggestion.rationale}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <span style={{ color: zsColors.semantic.success }}>
                          +{suggestion.expectedImpact.prescriptionIncrease} Rx
                        </span>
                        <span style={{ color: zsColors.secondary.blue }}>
                          {(suggestion.expectedImpact.engagementScore * 100).toFixed(0)}% engagement
                        </span>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{
                          backgroundColor: zsColors.primary.navy,
                          color: zsColors.neutral.white
                        }}>
                        View Details
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    {/* Talking Points */}
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
                      <p className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                        Key Talking Points:
                      </p>
                      <ul className="space-y-1">
                        {suggestion.talkingPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle size={12} style={{ color: zsColors.semantic.success }} className="mt-0.5" />
                            <span className="text-xs" style={{ color: zsColors.neutral.darkGray }}>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Email Drafting */}
          {activeFeature === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Email Drafting Assistant
                </h4>
                <button
                  onClick={handleDraftEmail}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: zsColors.secondary.blue,
                    color: zsColors.neutral.white
                  }}
                >
                  Generate Draft
                </button>
              </div>

              {emailDraft && (
                <div className="rounded-lg p-4" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <div className="mb-3">
                    <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>To:</label>
                    <input
                      type="text"
                      value={emailDraft.to}
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: zsColors.neutral.offWhite,
                        border: `1px solid ${zsColors.neutral.lightGray}`,
                        color: zsColors.neutral.charcoal
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>Subject:</label>
                    <input
                      type="text"
                      value={emailDraft.subject}
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: zsColors.neutral.offWhite,
                        border: `1px solid ${zsColors.neutral.lightGray}`,
                        color: zsColors.neutral.charcoal
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>Message:</label>
                    <textarea
                      value={emailDraft.body}
                      rows={8}
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: zsColors.neutral.offWhite,
                        border: `1px solid ${zsColors.neutral.lightGray}`,
                        color: zsColors.neutral.charcoal
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        Personalization Score:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={star <= Math.round(emailDraft.personalizationScore * 5) ? zsColors.semantic.warning : 'none'}
                            style={{ color: zsColors.semantic.warning }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium" style={{ color: zsColors.semantic.success }}>
                        {(emailDraft.personalizationScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-100"
                        style={{
                          backgroundColor: zsColors.neutral.offWhite,
                          color: zsColors.neutral.darkGray,
                          border: `1px solid ${zsColors.neutral.lightGray}`
                        }}>
                        Schedule
                      </button>
                      <button className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{
                          backgroundColor: zsColors.secondary.blue,
                          color: zsColors.neutral.white
                        }}>
                        <Send size={14} />
                        Send Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Virtual Coaching */}
          {activeFeature === 'coaching' && (
            <motion.div
              key="coaching"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                Virtual Coaching Simulator
              </h4>

              {!coachingSession ? (
                <div className="grid grid-cols-2 gap-4">
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleStartCoaching(level)}
                      className="rounded-lg p-6 text-center transition-all hover:shadow-md"
                      style={{
                        backgroundColor: zsColors.neutral.white,
                        border: `2px solid ${zsColors.neutral.lightGray}`,
                      }}
                    >
                      <Brain size={32} className="mx-auto mb-3" style={{ color: zsColors.secondary.teal }} />
                      <p className="font-medium mb-1" style={{ color: zsColors.neutral.charcoal }}>
                        {level} Level
                      </p>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        {level === 'Beginner' && 'Basic objection handling'}
                        {level === 'Intermediate' && 'Complex barriers'}
                        {level === 'Advanced' && 'Difficult conversations'}
                        {level === 'Expert' && 'KOL engagement'}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg p-4" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                      {coachingSession.scenario.name}
                    </h5>
                    <span className="text-sm px-3 py-1 rounded-full" style={{
                      backgroundColor: zsColors.secondary.teal + '20',
                      color: zsColors.secondary.teal
                    }}>
                      {coachingSession.currentState}
                    </span>
                  </div>

                  <div className="rounded-lg p-4 mb-4" style={{
                    backgroundColor: zsColors.neutral.offWhite,
                    minHeight: '200px'
                  }}>
                    <p className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                      {coachingSession.scenario.situation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{
                        backgroundColor: zsColors.semantic.error,
                        color: zsColors.neutral.white
                      }}>
                      End Session
                    </button>
                    <button className="flex-1 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{
                        backgroundColor: zsColors.secondary.teal,
                        color: zsColors.neutral.white
                      }}>
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Call Scheduling */}
          {activeFeature === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Smart Call Scheduler
                </h4>
                <button
                  onClick={handleScheduleCall}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: zsColors.primary.navy,
                    color: zsColors.neutral.white
                  }}
                >
                  Schedule Call
                </button>
              </div>

              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.white,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>HCP</label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: zsColors.neutral.offWhite,
                        border: `1px solid ${zsColors.neutral.lightGray}`,
                        color: zsColors.neutral.charcoal
                      }}>
                      <option>Dr. Smith - Oncology</option>
                      <option>Dr. Johnson - Cardiology</option>
                      <option>Dr. Williams - Neurology</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>Type</label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: zsColors.neutral.offWhite,
                        border: `1px solid ${zsColors.neutral.lightGray}`,
                        color: zsColors.neutral.charcoal
                      }}>
                      <option>In-Person</option>
                      <option>Virtual</option>
                      <option>Phone</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>Suggested Times</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['Tomorrow 2:00 PM', 'Thursday 10:00 AM', 'Friday 3:30 PM'].map((time) => (
                      <button key={time} className="px-3 py-2 rounded-lg text-xs transition-colors hover:bg-white"
                        style={{
                          backgroundColor: zsColors.neutral.offWhite,
                          border: `1px solid ${zsColors.neutral.lightGray}`,
                          color: zsColors.neutral.darkGray
                        }}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium" style={{ color: zsColors.neutral.gray }}>Agenda</label>
                  <textarea
                    placeholder="Discussion points..."
                    rows={3}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: zsColors.neutral.offWhite,
                      border: `1px solid ${zsColors.neutral.lightGray}`,
                      color: zsColors.neutral.charcoal
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Note Recording */}
          {activeFeature === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                Call Note Recording
              </h4>

              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.white,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-full transition-all ${isRecording ? 'animate-pulse' : ''}`}
                      style={{
                        backgroundColor: isRecording ? zsColors.semantic.error : zsColors.primary.navy,
                        color: zsColors.neutral.white
                      }}
                    >
                      <Mic size={20} />
                    </button>
                    <div>
                      <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                        {isRecording ? 'Recording...' : 'Click to start recording'}
                      </p>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        Voice-to-text transcription
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg transition-colors hover:bg-gray-100">
                    <Edit3 size={16} style={{ color: zsColors.neutral.gray }} />
                  </button>
                </div>

                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type or dictate your call notes..."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: zsColors.neutral.offWhite,
                    border: `1px solid ${zsColors.neutral.lightGray}`,
                    color: zsColors.neutral.charcoal
                  }}
                />

                <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
                  <p className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.gray }}>
                    Auto-detected:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: zsColors.secondary.orange + '20',
                      color: zsColors.secondary.orange
                    }}>
                      Barrier: B001
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: zsColors.semantic.success + '20',
                      color: zsColors.semantic.success
                    }}>
                      Sentiment: Positive
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: zsColors.secondary.blue + '20',
                      color: zsColors.secondary.blue
                    }}>
                      Follow-up Required
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSaveNote}
                  className="w-full mt-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: zsColors.primary.navy,
                    color: zsColors.neutral.white
                  }}
                >
                  Save Note to CRM
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}