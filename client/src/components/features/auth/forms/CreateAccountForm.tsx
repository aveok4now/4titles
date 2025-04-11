'use client'

import {
    createAccountSchema,
    CreateAccountSchemaType,
} from '@/schemas/auth/create-account.schema'
import { useForm } from 'react-hook-form'
import { AuthWrapper } from '../AuthWrapper'

import { Button } from '@/components/ui/common/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import { zodResolver } from '@hookform/resolvers/zod'

export function CreateAccountForm() {
    const form = useForm<CreateAccountSchemaType>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    const { isValid } = form.formState

    async function onSubmit(data: CreateAccountSchemaType) {
        // setIsLoading(true)

        try {
            // Handle form submission logic here
            console.table(data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
        } catch (error) {
            console.error(error)
        } finally {
            // setIsLoading(false)
        }
    }

    return (
        <AuthWrapper
            heading='Регистрация'
            backButtonQuestion='Уже есть аккаунт?'
            backButtonLabel='Войти'
            backButtonHref='/account/login'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel className='text-sm font-medium text-foreground'>
                                        Имя пользователя
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='username'
                                            className='h-11 border-input/50 bg-muted/30 focus-visible:ring-primary'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel className='text-sm font-medium text-foreground'>
                                        Электронная почта
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='example@example.com'
                                            className='h-11 border-input/50 bg-muted/30 focus-visible:ring-primary'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem className='space-y-1.5'>
                                <FormLabel className='text-sm font-medium text-foreground'>
                                    Пароль
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='********'
                                        type='password'
                                        className='h-11 border-input/50 bg-muted/30 focus-visible:ring-primary'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-xs' />
                            </FormItem>
                        )}
                    />

                    <Button
                        type='submit'
                        className='mt-4 h-11 w-full bg-primary font-medium text-primary-foreground hover:bg-primary/90'
                        disabled={!isValid}
                    >
                        {/* {isLoading ? 'Обработка...' : 'Продолжить'} */}
                        Продолжить
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
