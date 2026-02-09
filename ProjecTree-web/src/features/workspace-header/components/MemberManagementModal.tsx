import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { OnlineUser } from '../types';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { useWorkspaceDetail, useWorkspaceStore } from '@/features/workspace-core/stores/workspaceStore';
import { inviteMember, changeMemberRole, type TeamRoleType } from '@/apis/team.api';
import { getWorkspaceDetail } from '@/apis/workspace.api';

interface MemberManagementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onlineUsers: OnlineUser[];
    workspaceId: number;
}

export function MemberManagementModal({
    open,
    onOpenChange,
    onlineUsers,
    workspaceId,
}: MemberManagementModalProps) {
    const [activeTab, setActiveTab] = useState('invite');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('EDITOR');
    const [isLoading, setIsLoading] = useState(false);

    const workspaceDetail = useWorkspaceDetail();
    const setWorkspaceDetail = useWorkspaceStore((state) => state.setWorkspaceDetail);

    const handleSendInvite = async () => {
        if (!email.trim()) {
            toast.error('이메일 주소를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            await inviteMember({
                workspaceId,
                chatRoomId: workspaceDetail?.teamInfo?.chatRoomId || '',
                email: email.trim(),
                role: role as TeamRoleType,
            });
            toast.success(`${email}님을 초대했습니다.`);
            setEmail('');
            setRole('EDITOR');

            // 0.5초 대기 후 데이터 갱신 (서버 DB 반영 시간 확보)
            setTimeout(async () => {
                const updatedDetail = await getWorkspaceDetail(workspaceId);
                setWorkspaceDetail(updatedDetail);
            }, 500);
        } catch (error) {
            console.error('초대 실패:', error);
            toast.error('초대 메일 전송에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (memberId: number, newRole: string) => {
        try {
            await changeMemberRole({
                workspaceId,
                targetMemberId: memberId,
                role: newRole as TeamRoleType,
            });

            // 0.5초 대기 후 데이터 갱신 (서버 DB 반영 시간 확보)
            setTimeout(async () => {
                const updatedDetail = await getWorkspaceDetail(workspaceId);
                setWorkspaceDetail(updatedDetail);
            }, 500);

            toast.success('권한이 변경되었습니다.');
        } catch (error) {
            console.error('권한 변경 실패:', error);
            toast.error('권한 변경에 실패했습니다.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="
        sm:max-w-[480px]
        bg-white
        backdrop-blur-2xl
        border border-white/60
        shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12)]
        rounded-3xl
        z-[1001]
        p-0
        overflow-hidden
      ">
                <DialogHeader className="p-6 pb-2 bg-white">
                    <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                        워크스페이스 멤버 관리
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        팀원을 초대하거나 권한을 관리하세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-2 bg-white h-full">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-6 bg-zinc-100/50 p-1 rounded-xl">
                            <TabsTrigger
                                value="invite"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                            >
                                팀 초대
                            </TabsTrigger>
                            <TabsTrigger
                                value="members"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                            >
                                팀 멤버
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="invite" className="space-y-6 focus-visible:outline-none">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-zinc-600">
                                        이메일로 팀원을 초대하세요.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                            이메일 주소
                                        </Label>
                                        <Input
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-[var(--figma-neon-green)]/20 focus:border-[var(--figma-neon-green)] rounded-xl h-11"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                            권한
                                        </Label>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger className="w-full h-11 bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-[var(--figma-neon-green)]/20 focus:border-[var(--figma-neon-green)] rounded-xl">
                                                <SelectValue placeholder="권한 선택" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999] rounded-xl border-zinc-200 shadow-lg">
                                                <SelectItem value="OWNER">관리자 - 모든 권한</SelectItem>
                                                <SelectItem value="EDITOR">편집자 - 편집 가능</SelectItem>
                                                <SelectItem value="VIEWER">열람자 - 읽기 전용</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSendInvite}
                                    disabled={isLoading}
                                    className="w-full h-11 mt-8 bg-[var(--figma-neon-green)] text-[var(--figma-tech-green)] font-bold rounded-xl transition-all hover:bg-[var(--figma-neon-green)]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? '전송 중...' : '초대 메일 보내기'}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="members" className="focus-visible:outline-none">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-zinc-600">
                                        이곳에서 멤버를 관리할 수 있습니다.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pb-1">
                                    <h4 className="text-sm font-bold text-zinc-900">팀 멤버</h4>
                                    <span className="text-xs text-zinc-500">총 {onlineUsers.length}명 / 10명</span>
                                </div>

                                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {onlineUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <UserAvatar
                                                    initials={user.initials}
                                                    color={user.color}
                                                    size="md"
                                                    className="h-10 w-10 text-sm"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-zinc-900 leading-none">
                                                        {user.nickname || user.name}
                                                        {user.isMe && <span className="ml-1.5 text-[10px] text-zinc-400 font-normal">(나)</span>}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Select
                                                    defaultValue={user.role}
                                                    onValueChange={(newRole) => handleRoleChange(Number(user.id), newRole)}
                                                >
                                                    <SelectTrigger className="w-[100px] h-8 bg-white border-zinc-200 text-xs font-medium focus:ring-1 focus:ring-[var(--figma-neon-green)] rounded-lg">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="z-[9999] rounded-xl border-zinc-200 shadow-sm">
                                                        <SelectItem value="OWNER" className="text-xs">관리자</SelectItem>
                                                        <SelectItem value="EDITOR" className="text-xs">편집자</SelectItem>
                                                        <SelectItem value="VIEWER" className="text-xs">열람자</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
