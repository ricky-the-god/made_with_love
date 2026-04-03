"use client";

interface MemberLinkProps {
  memberId: string;
  memberName: string;
}

export function MemberLink({ memberId, memberName }: MemberLinkProps) {
  return (
    <a
      href={`/dashboard/tree/member/${memberId}`}
      className="hover:text-amber-700 hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {memberName}
    </a>
  );
}
