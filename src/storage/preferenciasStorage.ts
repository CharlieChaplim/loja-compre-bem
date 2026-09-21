import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_FAVORITOS = '@compre_bem:favoritos';
const CHAVE_MODO_COMPACTO = '@compre_bem:modo_compacto';

export type PreferenciasSalvas = {
  favoritos: string[];
  modoCompacto: boolean;
};

export async function carregarPreferencias(): Promise<PreferenciasSalvas> {
  const [favoritosSalvos, modoCompactoSalvo] = await Promise.all([
    AsyncStorage.getItem(CHAVE_FAVORITOS),
    AsyncStorage.getItem(CHAVE_MODO_COMPACTO),
  ]);

  return {
    favoritos: favoritosSalvos ? JSON.parse(favoritosSalvos) : [],
    modoCompacto: modoCompactoSalvo
      ? JSON.parse(modoCompactoSalvo)
      : false,
  };
}

export async function salvarFavoritos(favoritos: string[]) {
  await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

export async function salvarModoCompacto(modoCompacto: boolean) {
  await AsyncStorage.setItem(
    CHAVE_MODO_COMPACTO,
    JSON.stringify(modoCompacto)
  );
}
