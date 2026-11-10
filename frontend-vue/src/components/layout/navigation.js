export const navigationItems = [
  { label: 'Anuncios', routeName: 'anuncios', visibility: 'publica' },
  { label: 'Favoritos', routeName: 'favoritos', visibility: 'autenticada' },
  { label: 'Perfil', routeName: 'perfil', visibility: 'autenticada' }
]

export function itemsVisibles(items, autenticado) {
  return items.filter((item) => item.visibility === 'publica' || autenticado)
}
