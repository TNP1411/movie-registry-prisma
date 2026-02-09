import * as model from '../models/movieModel.js';

export const getAll = async (req, res) => {
    try {
        const movies = await model.findAll(req.query);

        if (!movies || movies.length === 0) {
            return res.status(200).json({
                message: 'Nenhum registro de filme encontrado.',
            });
        }
        res.json(movies);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio.',
            });
        }

        const { title, description, duration, genre, rating, Rating, available, avaiable } =
            req.body;

        const generosPermitidos = [
            'Ação',
            'Drama',
            'Comédia',
            'Terror',
            'Romance',
            'Animação',
            'Ficção Científica',
            'Suspense',
        ];

        if (rating < 0 || rating > 10) {
            return res.status(400).json({
                error: 'O rating deve ser um número entre 0 e 10.',
            });
        }

        if (!generosPermitidos.includes(genre)) {
            return res.status(400).json({
                error: `Gênero inválido. Precisa ser um destes gêneros: ${generosPermitidos.join(', ')}`,
            });
        }

        if (isNaN(duration) || duration <= 0 || duration > 300) {
            return res.status(400).json({
                error: 'A duração deve ser um número inteiro positivo e não pode exceder 300 minutos.',
            });
        }

        if (title.trim().length < 3) {
            return res.status(400).json({
                error: 'O título é obrigatório e deve conter no mínimo 3 caracteres.',
            });
        }

        const movieExists = await model.findAll({ title });

        if (movieExists && movieExists.length > 0) {
            return res
                .status(409)
                .json({ error: 'Já existe um filme cadastrado com este título.' });
        }


        if (description.trim().length < 10) {
            return res.status(400).json({
                error: 'A descrição é obrigatória e deve conter no mínimo 10 caracteres.',
            });
        }

        if (!title) return res.status(400).json({ error: 'O title é obrigatório!' });
        if (!duration) return res.status(400).json({ error: 'O duration é obrigatório!' });
        if (!genre) return res.status(400).json({ error: 'O genre é obrigatório!' });

        const movieData = {
            title,
            description,
            duration: parseInt(duration),
            genre,
            available:
                available !== undefined ? available : avaiable !== undefined ? avaiable : true,
        };

        const valorRating = rating !== undefined ? rating : Rating;
        if (valorRating !== undefined) {
            movieData.rating = parseFloat(valorRating);
        } else {
            return res.status(400).json({ error: 'O campo rating é obrigatório!' });
        }

        const data = await model.create(movieData);

        res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await model.findById(id);
        if (!data) {
            return res
                .status(404)
                .json({ error: 'Registro não encontrado, coloque um registro válido' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do filme!',
            });
        }
        if (req.body.available !== true) return res.status(400).json({
            error: 'O campo "available" deve ser true para atualizar!'
        });

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        const data = await model.update(id, req.body);
        res.json({
            message: `O registro "${data.title}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        if (exists.rating >= 9) {
            return res.status(400).json({
                error: 'Filmes com rating acima ou igual a 9 não podem ser deletados.',
            });
        }

        await model.remove(id);
        res.json({
            message: `O registro "${exists.title}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};
