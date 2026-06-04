import type { CSSProperties, ReactNode } from 'react'

interface WizardStepHeaderProps {
  title: string
  description?: ReactNode
  caption?: string
  centered?: boolean
}

export function WizardStepHeader({ title, description, caption, centered = false }: WizardStepHeaderProps) {
  return (
    <div style={{ ...headerRootStyle, ...(centered ? headerRootCenteredStyle : null) }}>
      <h1 style={headingStyle}>{title}</h1>
      {description ? (
        <div style={centered ? headerDescriptionCenteredStyle : headerDescriptionStyle}>
          {description}
        </div>
      ) : null}
      {caption ? <p style={captionStyle}>{caption}</p> : null}
    </div>
  )
}

interface WizardSectionCardProps {
  children: ReactNode
  title?: string
  subtitle?: ReactNode
  headerRight?: ReactNode
  accentTop?: boolean
}

export function WizardSectionCard({
  children,
  title,
  subtitle,
  headerRight,
  accentTop = false,
}: WizardSectionCardProps) {
  return (
    <section
      style={{
        ...cardStyle,
        ...(accentTop ? cardAccentStyle : null),
      }}
    >
      {title || subtitle || headerRight ? (
        <header style={cardHeaderStyle}>
          <div style={cardHeaderTextStyle}>
            {title ? <h2 style={cardTitleStyle}>{title}</h2> : null}
            {subtitle ? <div style={cardSubtitleStyle}>{subtitle}</div> : null}
          </div>
          {headerRight ? <div>{headerRight}</div> : null}
        </header>
      ) : null}
      <div style={cardBodyStyle}>{children}</div>
    </section>
  )
}

interface WizardHintProps {
  children: ReactNode
}

export function WizardHint({ children }: WizardHintProps) {
  return <div style={hintStyle}>{children}</div>
}

const headerRootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  marginBottom: 'var(--spacing-stack-m)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const headerRootCenteredStyle: CSSProperties = {
  justifyItems: 'center',
  textAlign: 'center',
}

const headingStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-heading-m-size, 32px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  lineHeight: 1.2,
}

const headerDescriptionStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  lineHeight: 1.45,
  maxWidth: '72ch',
}

const headerDescriptionCenteredStyle: CSSProperties = {
  ...headerDescriptionStyle,
  marginLeft: 'auto',
  marginRight: 'auto',
}

const captionStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 'var(--type-weight-medium, 500)',
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  overflow: 'hidden',
}

const cardAccentStyle: CSSProperties = {
  borderTop: '4px solid var(--color-background-primary)',
}

const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 'var(--spacing-inline-s)',
  padding: 'var(--spacing-inset-s)',
}

const cardHeaderTextStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xxs, 4px)',
}

const cardTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-bold, 700)',
}

const cardSubtitleStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.4,
}

const cardBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 'var(--spacing-inset-s)',
}

const hintStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--spacing-inline-xs)',
  padding: 'var(--spacing-inset-xs)',
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-secondary-lightest)',
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.45,
}
