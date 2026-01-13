"use client";

import { useCustomInstructionsStore } from "@/stores/customInstructionsStore";

const MAX_LENGTH = 1500;

export function CustomInstructionsForm() {
    const { aboutMe, responseStyle, setAboutMe, setResponseStyle } =
        useCustomInstructionsStore();

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="aboutMe" className="block text-sm font-medium mb-2">
                    나에 대해
                </label>
                <textarea
                    id="aboutMe"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="직업, 관심사, 배경 정보 등을 입력하세요"
                    maxLength={MAX_LENGTH}
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="text-xs text-[var(--text-secondary)] mt-1 text-right">
                    {aboutMe.length} / {MAX_LENGTH}
                </div>
            </div>

            <div>
                <label htmlFor="responseStyle" className="block text-sm font-medium mb-2">
                    응답 방식
                </label>
                <textarea
                    id="responseStyle"
                    value={responseStyle}
                    onChange={(e) => setResponseStyle(e.target.value)}
                    placeholder="응답 길이, 형식, 톤 등 원하는 응답 스타일을 입력하세요"
                    maxLength={MAX_LENGTH}
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="text-xs text-[var(--text-secondary)] mt-1 text-right">
                    {responseStyle.length} / {MAX_LENGTH}
                </div>
            </div>
        </div>
    );
}
