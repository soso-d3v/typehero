'use client';

import { Calendar, Flag, Share, X } from '@repo/ui/icons';
import Link from 'next/link';
import type { ChallengeSolution } from '~/app/[locale]/challenge/[id]/solutions/[solutionId]/page';
import { ReportDialog } from '~/components/ReportDialog';
import { getRelativeTime } from '~/utils/relativeTime';
import { ActionMenu } from '@repo/ui/components/action-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/use-toast';
import { TypographyLarge } from '@repo/ui/components/typography/large';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { Markdown } from '@repo/ui/components/markdown';
import { UserBadge } from '@repo/ui/components/user-badge';
import { Vote } from '../../../_components/vote';
import { useSession } from '@repo/auth/react';

interface Props {
  solution: ChallengeSolution;
}
export function SolutionDetails({ solution }: Props) {
  const { data: session } = useSession();
  const handleShareClick = async () => {
    if (navigator.clipboard) {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        variant: 'success',
        description: 'Link To Solution Copied!',
      });
    }
  };

  return (
    <div className="relative h-full">
      <div className="relative flex h-full flex-col">
        <div className="bg-background/90 dark:bg-muted/90 sticky right-0 top-0 flex w-full border-b border-zinc-300 p-2 backdrop-blur-sm dark:border-zinc-700">
          <Link href={`/challenge/${solution.challengeId}/solutions`}>
            <X className="stroke-gray-500 hover:stroke-gray-400" size={20} />
          </Link>
        </div>
        <div className="custom-scrollable-element flex-1 overflow-y-auto px-4 pb-16 pt-3">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage alt="github profile picture" src={solution.user?.image ?? ''} />
                  <AvatarFallback className="border border-zinc-300 dark:border-zinc-600">
                    {solution.user?.name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <TypographyLarge>{solution.title}</TypographyLarge>
              </div>
              <div className="flex items-center gap-2">
                <ReportDialog reportType="SOLUTION" solutionId={solution.id!}>
                  <ActionMenu
                    items={[
                      {
                        key: 'report',
                        label: 'Report',
                        icon: Flag,
                      },
                    ]}
                    onChange={() => {
                      // do nothing
                    }}
                  />
                </ReportDialog>
              </div>
            </div>
            {/* Author, Time, Action Buttons */}
            <div className="flex items-center gap-4">
              <UserBadge username={solution.user?.name ?? ''} linkComponent={Link} />
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">{getRelativeTime(solution.createdAt)}</span>
              </div>
              <Vote
                voteCount={solution._count.vote}
                initialHasVoted={solution.vote.length > 0}
                disabled={!session?.user?.id || solution.userId === session?.user?.id}
                rootType="SHAREDSOLUTION"
                rootId={solution.id}
                onVote={(didUpvote: boolean) => {
                  solution.vote = didUpvote
                    ? [
                        {
                          userId: session?.user?.id ?? '',
                        },
                      ]
                    : [];
                  solution._count.vote += didUpvote ? 1 : -1;
                }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleShareClick} variant="secondary" size="xs">
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Markdown>{solution.description || ''}</Markdown>
        </div>
      </div>
    </div>
  );
}
