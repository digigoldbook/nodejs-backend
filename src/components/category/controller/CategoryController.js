import CategoryModel from "../model/CategoryModel.js";
import CategoryMetaModel from "../model/CategoryMeta.js";

import slugs from "slugs";

// Fetch all categories with their metadata
export const getCategoriesWithMeta = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll({
      include: {
        model: CategoryMetaModel,
        as: "meta",
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// Add a new category with metadata
export const addCategory = async (req, res) => {
  const { cat_title, cat_description } = req.body;

  try {
    const newCategory = await CategoryModel.create({
      cat_title,
      cat_slug: slugs(cat_title),
      cat_description,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: `Failed to add category ${error}` });
  }
};

// Add metadata to an existing category
export const addMetaToCategory = async (req, res) => {
  const { cat_id, meta_key, meta_value } = req.body;

  try {
    const category = await CategoryModel.findByPk(cat_id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newMeta = await CategoryMetaModel.create({
      cat_id,
      meta_key,
      meta_value,
    });

    res.status(201).json(newMeta);
  } catch (error) {
    res.status(500).json({ message: `Failed to add metadata ${error}` });
  }
};

// Delete a category by ID and its associated metadata
export const deleteCategory = async (req, res) => {
  const { catId } = req.query;

  try {
    const category = await CategoryModel.findByPk(catId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    res.status(200).json({
      message: "Category and associated metadata deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete category ${error}` });
  }
};

const updateCategory = async (req, res) => {
  const { catId } = req.query;
  const { cat_title, cat_description } = req.body;

  try {
    // Find the category by its ID
    const category = await CategoryModel.findByPk(catId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category details
    await category.update({
      cat_title: cat_title || category.cat_title,
      cat_slug: cat_title ? slugs(cat_title) : category.cat_slug,
      cat_description: cat_description || category.cat_description,
    });

    // Fetch the updated category with its metadata
    const updatedCategory = await CategoryModel.findByPk(catId, {
      include: {
        model: CategoryMetaModel,
        as: "meta",
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to update category: ${error.message}` });
  }
};

const updateCategoryMeta = async (req, res) => {
  const { catId } = req.query;
  const { meta } = req.body;

  try {
    if (meta && Array.isArray(meta)) {
      for (const item of meta) {
        const { meta_key, meta_value } = item;

        const existingMeta = await CategoryMetaModel.findOne({
          where: {
            cat_id: catId,
            meta_key: meta_key,
          },
        });

        if (existingMeta) {
          await existingMeta.update({ meta_value });
        } else {
          await CategoryMetaModel.create({
            cat_id: catId,
            meta_key,
            meta_value,
          });
        }
      }
    }

    const updatedMeta = await CategoryMetaModel.findAll({
      where: { cat_id:catId },
    });

    res.status(200).json(updatedMeta);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to update metadata: ${error.message}` });
  }
};

export default {
  getCategoriesWithMeta,
  addCategory,
  addMetaToCategory,
  deleteCategory,
  updateCategory,
  updateCategoryMeta,
};
