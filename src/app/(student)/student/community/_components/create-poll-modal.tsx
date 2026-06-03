// app/(student)/community/_components/create-poll-modal.tsx
"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { PollCategory, CreatePollData } from "./types";

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreatePollData) => void;
}

const categoryOptions: { value: PollCategory; label: string }[] = [
  { value: "event", label: "Event Planning" },
  { value: "activity", label: "Activity" },
  { value: "facility", label: "Facility" },
  { value: "policy", label: "Policy" },
  { value: "other", label: "General" },
];

export function CreatePollModal({ isOpen, onClose, onCreate }: CreatePollModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PollCategory>("other");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<{ title?: string; options?: string[] }>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: { title?: string; options?: string[] } = {};
    
    if (!title.trim()) {
      newErrors.title = "Poll title is required";
    }
    
    const optionErrors: string[] = [];
    options.forEach((opt, idx) => {
      if (!opt.trim()) {
        optionErrors[idx] = `Option ${idx + 1} cannot be empty`;
      }
    });
    if (optionErrors.some(e => e)) {
      newErrors.options = optionErrors;
    }
    
    if (options.filter(opt => opt.trim()).length < 2) {
      newErrors.title = "Please add at least 2 options";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    let endsAt: string | undefined = undefined;
    if (hasEndDate && endDate) {
      const dateTime = endTime ? `${endDate}T${endTime}` : endDate;
      endsAt = new Date(dateTime).toISOString();
    }
    
    onCreate({
      title: title.trim(),
      description: description.trim(),
      category,
      options: options.filter(opt => opt.trim()),
      endsAt,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("other");
    setOptions(["", ""]);
    setHasEndDate(false);
    setEndDate("");
    setEndTime("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white p-5 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">Create New Poll</h2>
            <p className="mt-0.5 text-sm text-stone-500">Share your question with the community</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-stone-100">
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Poll Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-stone-200'} px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition`}
              placeholder="e.g., What activity should we organize next?"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Description <span className="text-stone-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition"
              placeholder="Provide more context about this poll..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    category === cat.value
                      ? "bg-[#2f2a24] text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Poll Options <span className="text-red-500">*</span>
              <span className="text-stone-400 text-xs ml-2">(minimum 2 options)</span>
            </label>
            <div className="space-y-2">
              {options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-sm text-stone-400">{idx + 1}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className={`flex-1 rounded-xl border ${errors.options?.[idx] ? 'border-red-300 bg-red-50' : 'border-stone-200'} px-4 py-2 text-sm focus:border-[#9d7443] focus:outline-none transition`}
                    placeholder={`Option ${idx + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 text-stone-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 inline-flex items-center gap-1 text-sm text-[#9d7443] hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add another option
              </button>
            )}
          </div>

          {/* End Date (Optional) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="hasEndDate"
                checked={hasEndDate}
                onChange={(e) => setHasEndDate(e.target.checked)}
                className="rounded border-stone-300 text-[#9d7443] focus:ring-[#9d7443]"
              />
              <label htmlFor="hasEndDate" className="text-sm text-stone-700">
                Set end date for this poll
              </label>
            </div>
            
            {hasEndDate && (
              <div className="flex gap-3 mt-2">
                <div className="flex-1">
                  <label className="block text-xs text-stone-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-4 py-2 text-sm focus:border-[#9d7443] focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-stone-500 mb-1">End Time (optional)</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-4 py-2 text-sm focus:border-[#9d7443] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tips Box - Không icon, chữ rõ ràng */}
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-700 mb-2">📝 Tips for creating a good poll</p>
            <ul className="space-y-1.5 text-sm text-stone-600">
              <li>• Keep the title clear and specific</li>
              <li>• Provide enough context in the description</li>
              <li>• Make sure options don't overlap</li>
              <li>• Polls will be visible to all residents</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-stone-100 bg-white p-5 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-300 px-6 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-[#2f2a24] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#40382f]"
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}