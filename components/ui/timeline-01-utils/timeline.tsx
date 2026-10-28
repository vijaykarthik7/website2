"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  title: string;
  description: string;
  date: string;
  image?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("relative py-8 md:py-16 px-4 md:px-8", className)}>
      <div className="relative max-w-4xl mx-auto">
        {/* Continuous vertical line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-border" />

        <div className="space-y-12 md:space-y-20">
          {items.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex flex-col md:flex-row items-start gap-6 md:gap-12",
                  isEven ? "md:flex-row-reverse" : ""
                )}
              >
                {/* Node Milestone Circle */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-background shadow-[0_0_12px_rgba(255,185,0,0.4)]" />
                </div>

                {/* Content Side */}
                <div className="ml-10 md:ml-0 md:w-1/2 space-y-3">
                  <div className="inline-flex items-center rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground bg-muted/30">
                    {item.date}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Image Side */}
                <div className="ml-10 md:ml-0 md:w-1/2">
                  {item.image && (
                    <div className="overflow-hidden rounded-xl border border-border shadow-md bg-muted/10 group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
