"use client";

import { MultiTaskItem } from "@/lib/form-schema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface TaskItemProps {
  task: MultiTaskItem;
  onUpdate: (updatedTask: MultiTaskItem) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle duration as a number
    if (name === "estimatedDuration") {
      setEditedTask({
        ...editedTask,
        [name]: parseInt(value, 10),
      });
    } else {
      setEditedTask({
        ...editedTask,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Task name
            </label>
            <Input
              name="summary"
              value={editedTask.summary}
              onChange={handleInputChange}
              placeholder="Enter task name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out"
              placeholder="Enter task description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Estimated duration (minutes)
            </label>
            <select
              name="estimatedDuration"
              value={editedTask.estimatedDuration}
              onChange={handleInputChange as any}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all duration-200 ease-in-out"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
              <option value="240">4 hours</option>
            </select>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        // View mode
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{task.summary}</h3>
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {task.estimatedDuration} min
            </span>
          </div>
          
          {task.description && (
            <p className="text-indigo-600 text-sm mb-4">{task.description}</p>
          )}
          
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}