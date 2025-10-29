# 🚀 Meauxbility Development Setup Guide

## 📁 **Current Setup:**

### **LIVE SITE (DO NOT TOUCH):**
- **Repository:** `https://github.com/InnerAnimal/meauxbility.orgg.git`
- **Live URL:** `https://meauxbility-501-c-3.onrender.com/`
- **Status:** ✅ WORKING - Keep this safe!

### **DEVELOPMENT SITE (Safe to experiment):**
- **Repository:** `https://github.com/InnerAnimal/meauxbility.orgg.git` (development branch)
- **Development URL:** `https://inneranimal.github.io/meauxbility-dev/` (GitHub Pages)
- **Status:** 🔧 EXPERIMENTAL - Safe to break and fix

---

## 🛠️ **Development Workflow:**

### **1. Work on Development Version:**
```bash
# Navigate to development folder
cd /Users/brandonprimeaux/Downloads/meauxbility-dev

# Make sure you're on development branch
git checkout development

# Make your changes here
# Test locally
npm start

# Commit changes
git add .
git commit -m "Your changes here"
git push origin development
```

### **2. Deploy to GitHub Pages:**
```bash
# Push development branch to GitHub Pages
git push origin development

# GitHub Pages will automatically deploy from development branch
# Access at: https://inneranimal.github.io/meauxbility-dev/
```

### **3. When Ready for Production:**
```bash
# Only after testing on development site:
cd /Users/brandonprimeaux/Downloads/meauxbility.org
git checkout main
git merge development
git push origin main
```

---

## 🎯 **Safe Development Process:**

### **Step 1: Always Work in Development**
- ✅ Make changes in `/meauxbility-dev/` folder
- ✅ Test on GitHub Pages first
- ✅ Never touch `/meauxbility.org/` directly

### **Step 2: Test Before Production**
- ✅ Verify changes work on GitHub Pages
- ✅ Check mobile responsiveness
- ✅ Test all navigation links
- ✅ Ensure styling looks good

### **Step 3: Deploy to Production**
- ✅ Only merge to main when 100% satisfied
- ✅ Keep development branch as backup
- ✅ Tag stable versions

---

## 📋 **Quick Commands:**

### **Start Development:**
```bash
cd /Users/brandonprimeaux/Downloads/meauxbility-dev
git checkout development
# Make your changes
```

### **Deploy to GitHub Pages:**
```bash
git add .
git commit -m "Development update"
git push origin development
# Check: https://inneranimal.github.io/meauxbility-dev/
```

### **Deploy to Production (when ready):**
```bash
cd /Users/brandonprimeaux/Downloads/meauxbility.org
git checkout main
git pull origin development
git push origin main
```

---

## 🚨 **Safety Rules:**

1. **NEVER** work directly in `/meauxbility.org/` folder
2. **ALWAYS** test on GitHub Pages first
3. **ONLY** merge to main when development site looks perfect
4. **KEEP** development branch as backup
5. **TAG** stable versions before major changes

---

## 🔗 **URLs:**

- **Live Site:** https://meauxbility-501-c-3.onrender.com/
- **Development Site:** https://inneranimal.github.io/meauxbility-dev/
- **GitHub Repo:** https://github.com/InnerAnimal/meauxbility.orgg

---

## 💡 **Pro Tips:**

- Use GitHub Pages for instant previews
- Keep development branch separate from main
- Test everything on development first
- Use descriptive commit messages
- Tag stable versions for easy rollback

**Now you can safely experiment without breaking the live site!** 🎉
