import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Building2, 
  Bot, 
  Calendar,
  Clock,
  Activity,
  Check,
  X
} from 'lucide-react';

export interface ComplianceAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  details?: string;
  impactedBot: string;
  venue?: string;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved';
  triggeredBy?: string;
  riskScore?: number;
  recommendations?: string[];
}

interface AlertDetailsModalProps {
  alert: ComplianceAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: () => void;
  onResolve?: () => void;
}

export function AlertDetailsModal({ 
  alert, 
  isOpen, 
  onClose, 
  onAcknowledge,
  onResolve 
}: AlertDetailsModalProps) {
  
  if (!alert) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="destructive">Open</Badge>;
      case 'acknowledged': return <Badge className="bg-yellow-100 text-yellow-800">Acknowledged</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Compliance Alert Details
          </DialogTitle>
          <DialogDescription>
            Review the compliance alert details and take appropriate action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{alert.reason}</h3>
              <div className="flex gap-2">
                {getSeverityBadge(alert.severity)}
                {getStatusBadge(alert.status)}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>ID: {alert.id}</div>
              <div>{new Date(alert.timestamp).toLocaleString()}</div>
            </div>
          </div>

          <Separator />

          {/* Alert Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Bot className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Impacted Bot</div>
                  <div className="text-sm text-gray-600">{alert.impactedBot}</div>
                </div>
              </div>
              
              {alert.venue && (
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Venue</div>
                    <div className="text-sm text-gray-600">{alert.venue}</div>
                  </div>
                </div>
              )}

              {alert.triggeredBy && (
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Triggered By</div>
                    <div className="text-sm text-gray-600">{alert.triggeredBy}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Detection Time</div>
                  <div className="text-sm text-gray-600">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Time Since Detection</div>
                  <div className="text-sm text-gray-600">
                    {Math.round((Date.now() - new Date(alert.timestamp).getTime()) / (1000 * 60))} minutes ago
                  </div>
                </div>
              </div>

              {alert.riskScore !== undefined && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Risk Score</div>
                    <div className="text-sm text-gray-600">{alert.riskScore}/100</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {alert.details && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Alert Details</h4>
                <p className="text-sm text-gray-600">{alert.details}</p>
              </div>
            </>
          )}

          {alert.recommendations && alert.recommendations.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {alert.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {alert.status === 'open' && onAcknowledge && (
              <Button 
                variant="outline" 
                onClick={onAcknowledge}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            {alert.status !== 'resolved' && onResolve && (
              <Button 
                onClick={onResolve}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}