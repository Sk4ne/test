import { Router,Request,Response, NextFunction } from 'express'
import {validateJwt } from '../../middlewares/validateJwt'
import { check } from 'express-validator'
/* check() is a middleware used to validate the incoming data as per the fields */

import {
    addSurvey,
    deleteSurvey,
    getSurvey,
    getSurveys,
    getSurveyQuestion,
    updateSurvey,
    updateSubQuestion,
    pushQuestion,
    deleteAllSurvey,
    updateSubQuestionOption,
} from '../../controllers/surveyController'
import { validateFields } from '../../middlewares/validateFields';
import { titleSurveyUn } from '../../helpers/fieldQuestUnique';
import { deleteQuestion } from '../../controllers/surveyController';
import { existMongoId } from '../../helpers/validId';

const router: Router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Survey:
 *      type: object
 *      properties: 
 *        id:
 *          type: string
 *          description: Survey id autogenerated
 *        titleSurvey:
 *          type: string
 *          description: Title survey
 *        description:
 *          type: string
 *          description: Description survey
 *        question:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              titleQuestion:
 *                type: string
 *                description: Title question
 *              typeQuestion: 
 *                type: string
 *                description: Type question QUESTION_OPEN or QUESTION_MULTIPLE
 *              answerO:
 *                type: string
 *                description: Answer question open (QUESTION_OPEN)
 *              answerM:
 *                type: object
 *                properties:
 *                  options:
 *                    type: array
 *                    opt1: string
 *                  answer:
 *                    type: string
 *                    description: Answer question multiple (QUESTION_MULTIPLE)
 *        createAt:
 *          type: string
 *          description: Survey creation date
 *        state:
 *          type: boolean
 *          description: If true, the survey is active
 *      required:
 *        - titleSurvey
 *        - description 
 *      example:
 *        id: 639254d35f2830c32ee8cb32
 *        titleSurvey: Stack de tecnologias mas usadas en 2022
 *        description: El objetivo de esta encuesta es conocer la opinion de los devs
 *    SurveyNotFound:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: a messsage for the not found survey
 *      example:
 *       message: Survey was not found 
 *    QuestionNotFound:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: a message for the not found question 
 *      example:
 *        message: Question was not found
 *  parameters:
 *    surveyId:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: Id from survey
 *    surveyID:
 *        in: path
 *        name: idSurvey
 *        required: true
 *        schema:
 *          type: string  
 *        description: Id from Survey
 *    questionID: 
 *        in: path
 *        name: idQuestion
 *        required: true
 *        schema:
 *          type: string
 *        description: Id from Question  
 */

/**
 * @swagger 
 * tags:
 *  name: Surveys
 *  description: Survey EndPoints
 */

/**
 * @swagger
 * /surveys:
 *  get:
 *    summary: Return all surveys
 *    tags: [Surveys]
 *    responses:
 *      200:
 *        description: Lists of surveys
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Survey'
 *                
 */

/* OBTENER TODAS LAS ENCUESTAS */
router.get('/surveys',getSurveys);
/**
 * 
 * @swagger
 * /survey/{id}:
 *  get:
 *    summary: Get one survey by ID
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyId'
 *    responses: 
 *      200:
 *        description: Survey was found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey' 
 *      500:
 *        description: Error in the server 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SurveyNotFound'
 */


/* OBTENER UNA ENCUESTA POR ID  */
router.get('/survey/:id',[
  check('id','Is not a valid ID').isMongoId(),
  check('id').custom(existMongoId),
  validateFields
],getSurvey);

/**
 * 
 * @swagger
 * /survey/{idSurvey}/{idQuestion}:
 *  get:
 *    summary: Get a question from a survey
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyID'
 *      - $ref: '#/components/parameters/questionID'
 *    responses:
 *      200:
 *        description: Question was found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      404:
 *        description: Dont exist question with this ID 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuestionNotFound'
 * 
 */
/* OBTENER UNA PREGUNTA DE UNA ENCUESTA */
router.get('/survey/:idSurvey/:idQuestion',[
  check('idSurvey','Is not a valid ID').isMongoId(),
  check('idSurvey').custom(existMongoId),
  check('idQuestion', 'Is not a valid ID').isMongoId(),
  validateFields
],getSurveyQuestion);

/**
 * @swagger 
 * /survey/{idSurvey}/{idQuestion}:
 *  delete:
 *    summary: Delete a question from a survey
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyID'
 *      - $ref: '#/components/parameters/questionID'
 *    responses:
 *      200:
 *        description: Delete a question from a survey
 *        content:  
 *          application/json:
 *            schema:
 *              $ref: '#/components/Schemas/Survey'
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuestionNotFound' 
 */
/* ELIMINAR UNA PREGUNTA DE UNA ENCUESTA */
router.delete('/survey/:idSurvey/:idQuestion',[
  check('idSurvey','Is not a valid ID').isMongoId(),
  check('idSurvey').custom(existMongoId),
  check('idQuestion','Is not a valid ID').isMongoId(),
  validateFields
],deleteQuestion)

/**
 * @swagger
 * /survey:
 *  post:
 *    summary: Create new survey
 *    tags: [Surveys]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      201:
 *        description: Survey created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Server error
 */

/* CREAR UNA ENCUESTA */
router.post('/survey',[
  check('titleSurvey').custom(titleSurveyUn),
  check('titleSurvey','titleSurvey is required')
    .not().isEmpty(),
  check('description','description is required')
    .not().isEmpty(),
  check('question.*.titleQuestion','titleQuestion is required')
    .not().isEmpty(),
  check('question.*.typeQuestion','typeQuestion is required')
    .not().isEmpty(),

  validateFields
],addSurvey);

/**
 * @swagger
 * /survey/{id}:
 *  put:
 *    summary: Update survey
 *    tags: [Surveys]
 *    parameters: 
 *      - $ref: '#/components/parameters/surveyId'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      200:
 *        description: Survey update
 *        content:
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SurveyNotFound'
 */

/* ACTUALIZAR UNA ENCUESTA */
router.put('/survey/:id',[
  check('id','Is not a valid ID').isMongoId(),
  check('id').custom(existMongoId),
  validateFields
],updateSurvey);

/**
 * @swagger 
 * /sub-question/{id}/{idQuestion}:
 *  put:
 *    summary: Update a question from a survey (Answer a question)
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyId'
 *      - $ref: '#/components/parameters/questionID'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      200:
 *        description: Question was found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      404:
 *        description: Dont exist question with this ID
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuestionNotFound' 
 */
/* ACTUALIZAR UNA PREGUNTA DE UNA ENCUESTA (responder la pregunta) */
router.put('/sub-question/:id/:idQuestion',[
  check('id','Is not a valid ID').isMongoId(),
  check('id').custom(existMongoId),
  check('idQuestion','Is not a valid ID').isMongoId(),
  validateFields
],updateSubQuestion);

/**
 * @swagger
 * /question/option/{id}/{idQuestion}:
 *  put:
 *    summary: Actualizar las opciones de una pregunta tipo QUESTION_MULTIPLE
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyId'
 *      - $ref: '#/components/parameters/questionID'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      200:
 *        description: Question was found
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      404:
 *        description: Dont exist question with this ID
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'    
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuestionNotFound'
 *    
 */   
/* ACTUALIZAR LAS OPCIONES DE UNA PREGUNTA tipo OPTION_MULTIPLE QUE PERTENECE A UNA ENCUESTA */
router.put('/question/option/:id/:idQuestion',[
  check('id','Is not a valid ID').isMongoId(),
  check('id').custom(existMongoId),
  check('idQuestion','Is not a valid ID').isMongoId(),
  validateFields
],updateSubQuestionOption);

/**
 * @swagger
 * /survey/{id}:
 *  delete:
 *    summary: Delete survey by ID
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyId'
 *    responses: 
 *      200:
 *        description: Survey was delete succesfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:  
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SurveyNotFound'
 * 
 */

/* ELIMINAR UNA ENCUESTA */
router.delete('/survey/:id',[
  check('id','Is not a valid ID').isMongoId(),
  check('id').custom(existMongoId),
  validateFields
],deleteSurvey);

/**
 * @swagger
 * /push-question/{idSurvey}:
 *  put:
 *    summary: Add a question to the survey
 *    tags: [Surveys]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyID'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      200:
 *        description: Question was found
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuestionNotFound'
 */
/* AGREGAR UNA PREGUNTA A UNA ENCUESTA */
router.put('/push-question/:idSurvey',[
  check('idSurvey','Is not a valid ID').isMongoId(),
  check('idSurvey').custom(existMongoId),
  validateFields
],pushQuestion);

/* ESTA RUTA ES DE PRUEBA... */
router.delete('/survey',deleteAllSurvey);

export default router;



