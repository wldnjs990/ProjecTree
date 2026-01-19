import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="p-20">
      <div>예시용 homepage입니다.</div>
      <Button
        className="w-20 h-5 py-10 border-black border-2"
        onClick={() => {
          alert('일반 html 태그 사용하는것처럼 쓰면 됩니당.');
        }}
      >
        Shadcn 버튼 컴포넌트
      </Button>
    </div>
  );
}
