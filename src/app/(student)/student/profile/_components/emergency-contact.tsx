// app/(student)/profile/_components/emergency-contact.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, Edit2, Save, X, ChevronDown, Check } from "lucide-react";
import type { EmergencyContact as EmergencyContactType } from "./types";

interface EmergencyContactProps {
  contact: EmergencyContactType;
  onUpdate?: (data: Partial<EmergencyContactType>) => void;
}

const relationshipOptions = [
  { value: "Parent", label: "Parent" },
  { value: "Mother", label: "Mother" },
  { value: "Father", label: "Father" },
  { value: "Guardian", label: "Guardian" },
  { value: "Sibling", label: "Sibling" },
  { value: "Relative", label: "Relative" },
  { value: "Other", label: "Other" },
];

export function EmergencyContact({ contact, onUpdate }: EmergencyContactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    relationship: contact.relationship,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    onUpdate?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    setIsEditing(false);
  };

  const selectedRelationshipLabel = relationshipOptions.find(
    (opt) => opt.value === formData.relationship
  )?.label || formData.relationship;

  return (
    <div className="rounded-xl border-2 border-stone-300/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-[#9d7443]" />
          <h3 className="text-lg font-bold text-stone-900">Emergency Contact</h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-full bg-emerald-600 p-1.5 text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="rounded-full bg-stone-200 p-1.5 text-stone-600 transition hover:bg-stone-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        // View Mode
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Full Name</p>
            <p className="text-base font-medium text-stone-900">{contact.name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Phone Number</p>
            <p className="text-base text-stone-800">{contact.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Relationship</p>
            <p className="text-base text-stone-800">{contact.relationship}</p>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition"
              placeholder="Parent/Guardian name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition"
              placeholder="+84 XXX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Relationship</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-left flex items-center justify-between focus:border-[#9d7443] focus:outline-none transition bg-white"
              >
                <span className={formData.relationship ? "text-stone-900" : "text-stone-400"}>
                  {selectedRelationshipLabel || "Select relationship"}
                </span>
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border-2 border-stone-200 bg-white shadow-lg overflow-hidden">
                  {relationshipOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, relationship: option.value });
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-stone-50 transition"
                    >
                      <span className="text-stone-700">{option.label}</span>
                      {formData.relationship === option.value && (
                        <Check className="h-4 w-4 text-[#9d7443]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}