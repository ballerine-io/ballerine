import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React from 'react';
import { Card, CardContent, CardHeader } from '@ballerine/ui';
import { Brain } from 'lucide-react';

const AITechIcon = () => {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-300/30">
      <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20" />
      <Brain className="relative h-6 w-6 text-white" />
    </div>
  );
};

export const useAISummaryBlock = ({ isDemoAccount }: { isDemoAccount: boolean }) => {
  return isDemoAccount
    ? createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'node',
          value: (
            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center gap-2 py-3 font-bold">
                <AITechIcon />
                AI Summary
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  Based on comprehensive analysis of the provided documentation and data points,
                  this case presents several notable characteristics:
                </p>

                <div className="space-y-2">
                  <div>
                    <strong>1) Risk Assessment: Medium-Low (🟨 3.2/10)</strong>
                    <ul className="list-disc pl-6 pt-1">
                      <li>
                        Identity verification: All documents appear authentic with 98.7% confidence
                      </li>
                      <li>Financial patterns: No suspicious transaction patterns detected</li>
                      <li>
                        Background screening: Minor discrepancies in address history require
                        attention
                      </li>
                    </ul>
                  </div>

                  <div>
                    <strong>2) Key Observations:</strong>
                    <ul className="list-disc pl-6 pt-1">
                      <li>Company operational history aligns with industry standards</li>
                      <li>Beneficial ownership structure is transparent and well-documented</li>
                      <li>Recent regulatory compliance updates have been properly implemented</li>
                    </ul>
                  </div>

                  <div>
                    <strong>3) Recommendations:</strong>
                    <ul className="list-disc pl-6 pt-1">
                      <li>Proceed with standard verification protocol</li>
                      <li>Request clarification on address history discrepancies</li>
                      <li>Schedule quarterly compliance review</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
        })
        .build()
    : null;
};
