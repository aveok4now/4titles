import FadeContent from '@/components/ui/custom/content/fade-content'
import BlurText from '@/components/ui/custom/text/blur-text'

interface AuthFeedbackProps {
    title: string
    description: string
}

export function AuthFeedback({ title, description }: AuthFeedbackProps) {
    return (
        <div className='flex flex-col items-center gap-4 py-4 text-center'>
            <BlurText
                className='text-md font-semibold text-foreground md:text-xl'
                text={title}
                delay={100}
            />
            <FadeContent delay={125} duration={1500} blur>
                <p className='max-w-fit text-sm text-muted-foreground'>
                    {description}
                </p>
            </FadeContent>
        </div>
    )
}
