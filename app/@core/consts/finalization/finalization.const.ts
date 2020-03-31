import { FinalizationModel } from '../../models/finalization/finalization.model';

export const FinalizationConst = {
    error: 500,
    errorServerFailure: 504,
    success: 200,
    vaccine_duplicated: 409,
};

/* #region ####################### Cadastro Vacinas ################################ */
/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer sucesso
 */
export const FinalizationRegisterVaccineSucessConst: FinalizationModel = {
    successImg: true,
    buttonName2: 'Finalizar',
    buttonName1: 'Cadastrar Nova',
    title: 'Vacina cadastrada com sucesso.',
};

/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer algum erro
 */
export const FinalizationRegisterVaccineErrorConst: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    title: 'Não foi possivel cadastrar a vacina.',
};

/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer error de duplicidade
 */
export const FinalizationRegisterVaccineDuplicatedConst: FinalizationModel = {
    successImg: false,
    buttonName2: 'Finalizar',
    buttonName1: 'Voltar',
    title: 'Vacina já cadastrada.',
};

/* #endregion */

/* #region ####################### Editar Vacinas ################################ */
/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer sucesso
 */
export const FinalizationEditVaccineSucessConst: FinalizationModel = {
    successImg: true,
    buttonName2: 'Finalizar',
    buttonName1: 'Editar novamente',
    title: 'Vacina editada com sucesso.',
};

/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer algum erro
 */
export const FinalizationEditVaccineErrorConst: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    title: 'Não foi possivel Editar a vacina.',
};

/* #endregion */

/* #region ####################### Cadastro Vacinas MODAL ################################ */
/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer sucesso
 */
export const FinalizationRegisterVaccineSucessModalConst: FinalizationModel = {
    successImg: true,
    buttonName2: 'Finalizar',
    buttonName1: '',
    title: 'Vacina cadastrada com sucesso.',
}

/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer algum erro
 */
export const FinalizationRegisterVaccineErrorModalConst: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    title: 'Não foi possivel cadastrar a vacina.',
}

/**
 * Constante contendo as configurações para o cadastro de vacina, utilizada na tela de finalização
 * quando ocorrer error de duplicidade
 */
export const FinalizationRegisterVaccineDuplicatedModalConst: FinalizationModel = {
    successImg: false,
    buttonName2: 'Finalizar',
    buttonName1: 'Voltar',
    title: 'Vacina já cadastrada.',
}

/* #endregion */


/* #region ####################### Cadastro Patologia ################################ */
/**
 * Constante contendo as configurações para o cadastro de patologia e esquema.
 * Utilizada quando o cadastro for um sucesso.
 */
export const FinalizationRegisterPathologySuccess: FinalizationModel = {
    successImg: true,
    buttonName2: 'Finalizar',
    buttonName1: 'Cadastrar Nova',
    title: 'Patologia cadastrada com sucesso.',
};

/**
 * Constante contendo as configurações para o cadastro de patologia e esquema.
 * Utilizada quando houver erro no cadastro.
 */
export const FinalizationRegisterPathologyError: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    buttonName1: 'Voltar',
    title: 'Não foi possível finalizar o cadastro.',
}

/**
 * Constante contendo as configurações para o cadastro de patologia e esquema.
 * Utilizada quando houver erro de patologia duplicada ao tentar cadastrar.
 */
export const FinalizationRegisterPathologyErrorDuplicated: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    buttonName1: 'Voltar',
    title: 'Patologia já cadastrada.',
}

/**
 * Constante contendo as configurações para o cadastro de patologia e esquema.
 * Utilizada quando houver erro nos servidores e serviços do Rabbit ou Kafka.
 */
export const FinalizationRegisterPathologyErrorServerFailure: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    buttonName1: '',
    title: 'Tivemos um problema. Tente novamente mais tarde.',
}

/* #endregion */

/* #region ####################### Editar Patologia ################################ */
/**
 * Constante contendo as configurações para a edição de patologia e esquema.
 * Utilizada quando a edição for um sucesso.
 */
export const FinalizationEditPathologySuccess: FinalizationModel = {
    successImg: true,
    buttonName2: 'Finalizar',
    buttonName1: '',
    title: 'Patologia editada com sucesso.',
};

/**
 * Constante contendo as configurações para a edição de patologia e esquema.
 * Utilizada quando houver erro na edição.
 */
export const FinalizationEditPathologyError: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    buttonName1: 'Voltar',
    title: 'Não foi possível editar a patologia.',
}

/**
 * Constante contendo as configurações para a edição de patologia e esquema.
 * Utilizada quando houver erro nos servidores e serviços do Rabbit ou Kafka.
 */
export const FinalizationEditPathologyErrorServerFailure: FinalizationModel = {
    successImg: false,
    buttonName2: 'Ok',
    buttonName1: '',
    title: 'Tivemos um problema. Tente novamente mais tarde.',
}
/* #endregion */