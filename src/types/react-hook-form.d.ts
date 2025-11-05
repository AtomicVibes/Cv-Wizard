declare module 'react-hook-form' {
	import * as React from 'react'

	export type FieldValues = Record<string, any>
	export type FieldPath<T> = string & keyof T
	export type FieldPathValue<T, P extends FieldPath<T>> = any

	export type ControllerProps<
		TFieldValues extends FieldValues = FieldValues,
		TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
	> = any

	export const Controller: React.ComponentType<any>
	export const FormProvider: React.ComponentType<any>
	export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): any
	export function useForm<TFieldValues extends FieldValues = FieldValues>(): any
	export function useController<
		TFieldValues extends FieldValues = FieldValues,
		TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
	>(props: any): any

	export type UseFormReturn<TFieldValues extends FieldValues = FieldValues> = any
}
