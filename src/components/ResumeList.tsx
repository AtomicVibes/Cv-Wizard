'use client';

import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Plus } from 'lucide-react';

export function ResumeList() {
  const { resumeData, setActiveResume, activeDocumentId } = useResume();

  const handleSelectResume = (resume: any) => {
    setActiveResume(resume, resume.documentId);
  };

  const handleCreateNew = () => {
    // TODO: Implement create new resume logic
    console.log('Create new resume');
  };

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          My Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pb-3">
          <Button
            onClick={handleCreateNew}
            className="w-full"
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Resume
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="px-4 space-y-2">
            {!resumeData ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No resume yet. Create your first one!
              </p>
            ) : (
              <Button
                key={resumeData.documentId || 'current'}
                onClick={() => handleSelectResume(resumeData)}
                variant={activeDocumentId === resumeData.documentId ? "default" : "ghost"}
                className="w-full justify-start h-auto p-3"
              >
                <div className="text-left">
                  <div className="font-medium">
                    {resumeData.personalInfo?.name || 'My Resume'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {resumeData.personalInfo?.jobTitle || 'No title'}
                  </div>
                </div>
              </Button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}