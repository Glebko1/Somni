# Этап 4 — система Somnik

## 1) State logic

`deriveSomnikState(snapshot, rewards, selectedSkin)` строит состояние маскота на основе сна:

- **5 форм эволюции** по `sleep efficiency`:
  - `seed` — от 0
  - `dreamling` — от 50
  - `guardian` — от 65
  - `sage` — от 78
  - `astral` — от 90
- **Реакция Somnik** (`deriveReaction`):
  - `sleepy`, если высокий долг сна (`>=120`) или эффективность `<45`
  - `energetic`, если эффективность `>=75`, консистентность `>=65`, долг `<45`
  - `sad` — промежуточное состояние
- **Качество сна на виджете**:
  - интегральный score = `0.7 * efficiency + 0.3 * consistency`
  - label: `poor / fair / good / great`
  - percent: 0–100
- **Прогресс эволюции**: `nextEvolutionAt` — следующий порог эффективности.

## 2) Reward logic

`calculateRewards(previousRecoveryScore, snapshot, prevSkins, prevAvatars)`:

- Начисляет `recoveryScore` из восстановленных минут и эффективности.
- **Разблокировка скинов** по `recoveryScore`:
  - `classic` (0)
  - `aurora` (220)
  - `sunrise` (420)
  - `nebula` (640)
- **Аватары за восстановление сна**:
  - новый аватар каждые `180` recovery points
  - ids формата `recovery-avatar-N`
- Возвращает списки всех и только что открытых наград (`justUnlocked*`).

## 3) Animation triggers

`getAnimationPreset(reaction)` выбирает профиль анимации:

- `energetic`: быстрый пульс + активное подпрыгивание
- `sleepy`: медленный пульс + минимальное движение
- `sad`: нейтральный ритм

В `SomnikAnimated` эти значения управляют `scale` и `translateY` через Reanimated.

## 4) Widget API

`buildWidgetPayload(currentState, previousQualityScore)` возвращает структуру для виджета:

- `mascot`: текущая форма, реакция, скин
- `sleepQuality`: score/percent/label и trend (`up|steady|down`)
- `recovery`: текущий recovery score и открытые аватары
- `progression`: порог следующей эволюции и разблокированные скины

Эта модель готова как для внутреннего UI, так и для отдачи в backend/widget layer.
