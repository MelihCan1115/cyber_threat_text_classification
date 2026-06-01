---

English [EN]

---

# SLM Fine-Tuning for Cyber Threat Intelligence Classification

Figure 1. Experimental pipeline: Dataset → QLoRA Fine-Tuning → Evaluation across 4 SLMs × 3 seeds.
(The figure was generated using Google Gemini for illustrative purposes.) [EN]

Şekil 1. Deney hattı: Veri Kümesi → QLoRA İnce Ayar → 4 SLM × 3 çekirdek değeri üzerinden değerlendirme.
(Şekil, açıklayıcı amaçlarla Google Gemini kullanılarak oluşturulmuştur.) [TR]

---

## Abstract

This project presents a comparative study of four Small Language Models (SLMs) fine-tuned using 4-bit Quantized Low-Rank Adaptation (QLoRA) for the task of Cyber Threat Intelligence (CTI) text classification. The `mrmoor/cyber-threat-intelligence` dataset (9,732 samples, 17 label classes) was used as the primary training corpus. Each model was trained across **3 random seeds (42, 123, 456)** for statistical robustness. Results show that **Gemma-2-2b** achieves the highest accuracy (70.12% ± 0.44%) while **Qwen2.5-1.5B** offers the best accuracy-to-size trade-off. All models substantially outperform zero-shot baselines, confirming the effectiveness of the QLoRA fine-tuning approach on domain-specific cybersecurity text.

---

## Objective

The aim of this project is to evaluate whether parameter-efficient fine-tuning (PEFT) via QLoRA can effectively adapt small open-source language models to a specialized cybersecurity classification task. Specifically, the study investigates:

- The relationship between model parameter count and classification accuracy
- The trade-off between model size, training time, and inference speed
- The capability of fine-tuned models to classify diverse CTI entity types (STIX ontology + NER labels)
- Cross-model comparison of error patterns using standardized test cases

---

## Methodology

### Models

Four SLMs were selected to cover a range of parameter sizes:

| Model | Parameters | Base |
|---|---|---|
| SmolLM2-360M | 205M | HuggingFaceTB/SmolLM2-360M |
| TinyLlama-1.1B | 551M | TinyLlama/TinyLlama-1.1B-Chat-v1.0 |
| Qwen2.5-1.5B | 889M | Qwen/Qwen2.5-1.5B |
| Gemma-2-2b | 1603M | google/gemma-2-2b-it |

### Fine-Tuning Method

All models were fine-tuned using **4-bit NF4 QLoRA** (Dettmers et al., 2023):

- LoRA rank: **r = 8**, alpha = 16, dropout = 0.1
- Target modules: all-linear layers
- Saved modules: `score` (classification head)
- Quantization: BitsAndBytes 4-bit NF4, compute dtype bfloat16

### Training Configuration

| Hyperparameter | Value |
|---|---|
| Epochs | 3 |
| Learning Rate | 2e-4 |
| Train Batch Size | 16 |
| Eval Batch Size | 32 |
| Warmup Ratio | 0.1 |
| Weight Decay | 0.01 |
| Best Model Criterion | macro_f1 |
| Mixed Precision | fp16 |
| Max Token Length | 128 |
| Hardware | NVIDIA Tesla T4 (15.6 GB VRAM) |

### Seeds Used

```python
SEEDS = [42, 123, 456]
```

### Dataset

```python
from datasets import load_dataset
dataset = load_dataset('mrmoor/cyber-threat-intelligence')
# Total: 9,732 samples  |  Train: 6,556  |  Val: 819  |  Test: 820
# Classes: 17 (filtered to classes with >= 20 samples)
```

**Label Classes (17 total):**

STIX 2.1 Ontology (8): `attack-pattern`, `campaign`, `identity`, `location`, `malware`, `threat-actor`, `tools`, `vulnerability`

NER Entity Types (9): `DOMAIN`, `FILEPATH`, `IPV4`, `O`, `SHA1`, `SHA2`, `SOFTWARE`, `TIME`, `URL`

---

## Key Findings

### 1. Classification Performance

Fine-tuning substantially improved accuracy across all models compared to zero-shot baselines:

| Model | Zero-Shot Accuracy | Fine-Tuned Accuracy | Gain |
|---|---|---|---|
| SmolLM2-360M | 3.5% | 45.45% ± 2.95% | +41.9 pp |
| TinyLlama-1.1B | 0.0% | 67.52% ± 0.79% | +67.5 pp |
| Qwen2.5-1.5B | 31.0% | 68.66% ± 1.85% | +37.7 pp |
| Gemma-2-2b | 35.5% | **70.12% ± 0.44%** | +34.6 pp |

### 2. Model Size vs. Performance Trade-off

| Model | Size | Accuracy | Inference |
|---|---|---|---|
| SmolLM2-360M | 350 MB | 45.45% | 11.7 ms/sample |
| TinyLlama-1.1B | 752 MB | 67.52% | 22.6 ms/sample |
| Qwen2.5-1.5B | 1,594 MB | 68.66% | 28.5 ms/sample |
| Gemma-2-2b | 3,379 MB | 70.12% | 41.0 ms/sample |

The largest accuracy gain per MB occurs between SmolLM2 (350 MB) and TinyLlama (752 MB): **+22.1 percentage points** for only +402 MB of model size.

### 3. Training Efficiency

| Model | Train Time (per seed) | GPU Memory |
|---|---|---|
| SmolLM2-360M | 14.1 min | 3,198 MB avg |
| TinyLlama-1.1B | 25.9 min | 3,262 MB avg |
| Qwen2.5-1.5B | 33.2 min | 4,910 MB avg |
| Gemma-2-2b | 48.4 min | 8,430 MB avg |

### 4. Error Analysis (Standardized Test — 5 Cases)

Five standardized texts were tested against all fine-tuned models (seed=42):

| Test | Expected | SmolLM2 | TinyLlama | Qwen2.5 | Gemma-2 |
|---|---|---|---|---|---|
| Ransomware text | `malware` | `O` ✗ | `malware` ✓ | `O` ✗ (85.9%) | `SOFTWARE` ✗ |
| Phishing text | `attack-pattern` | `O` ✗ | ✓ | ✓ | ✓ |
| CVE text | `vulnerability` | `O` ✗ | ✓ | ✓ | ✓ (98%) |
| Threat actor | `threat-actor` | `location` ✗ | `location` ✗ | ✓ (94.1%) | ✓ |
| C2 URL text | `URL` | `O` ✗ | `O` ✗ | `O` ✗ | ✓ (79.3%) |
| **Score** | | **0/5** | **3/5** | **3/5** | **4/5** |

---

## Results Summary

| Model | Parameters | Fine-Tuning | Accuracy | Macro-F1 | Train Time | Inference | Size |
|---|---|---|---|---|---|---|---|
| SmolLM2-360M | 205M | QLoRA | 0.4545 ± 0.0295 | 0.0601 ± 0.0180 | 14.1 min | 11.7 ms | 350 MB |
| TinyLlama-1.1B | 551M | QLoRA | 0.6752 ± 0.0079 | 0.4381 ± 0.0343 | 25.9 min | 22.6 ms | 752 MB |
| Qwen2.5-1.5B | 889M | QLoRA | 0.6866 ± 0.0185 | 0.4724 ± 0.0195 | 33.2 min | 28.5 ms | 1,594 MB |
| **Gemma-2-2b** | **1,603M** | **QLoRA** | **0.7012 ± 0.0044** | **0.4798 ± 0.0637** | **48.4 min** | **41.0 ms** | **3,379 MB** |

All metrics averaged across 3 seeds (42, 123, 456). Hardware: NVIDIA Tesla T4, Google Colab.

---

## Conclusion

Gemma-2-2b is the best-performing model overall, achieving 70.12% accuracy with the lowest seed variance (±0.44%), making it the most reliable choice for production deployment. Qwen2.5-1.5B offers the best accuracy-to-size ratio. SmolLM2-360M is not suitable for this 17-class task due to its tendency to collapse to the majority class (`O`). The key finding of the error analysis is that larger models can produce high-confidence wrong predictions (Qwen: 85.9% confident on a wrong label), which is potentially more dangerous in a real CTI pipeline than low-confidence errors.

---

## Repository Structure

```
slm-cti-classification/
├── notebooks/
│   └── LLM_Last_Result.ipynb      # Full training + evaluation pipeline
├── results/
│   ├── all_seed_results.json       # Raw per-seed metrics
│   ├── final_results_table.csv     # Aggregated results table
│   ├── zero_shot_baseline.csv      # Zero-shot baseline metrics
│   └── figures/
│       └── model_comparison.png    # Performance comparison chart
├── README.md
└── requirements.txt
```

---

## Setup and Execution

**1. Clone the repository:**
```bash
git clone https://github.com/MelihCan1115/slm-cti-classification.git
cd slm-cti-classification
```

**2. Install dependencies:**
```bash
pip install -r requirements.txt
```

**3. Run on Google Colab (recommended):**

Open the notebook directly on Google Colab: [LLM_Last_Result.ipynb on Colab]([https://colab.research.google.com/github/MelihCan1115/slm-cti-classification/blob/main/notebooks/LLM_Last_Result.ipynb](https://colab.research.google.com/drive/1SysgLq06HzCUf6xke7KXyBYGOHAlW58t?usp=sharing))

> Hardware requirement: GPU with ≥15 GB VRAM (Tesla T4 or better). Training all 4 models × 3 seeds takes approximately 4–5 hours.

**4. Hugging Face token (for model upload only):**

In Colab, open **🔑 Secrets** (left sidebar) and add:
- Key: `HF_TOKEN_WRITE`  
- Value: Your Hugging Face Write token from huggingface.co/settings/tokens

---

## Access Links

- **Google Colab Notebook:** [Open in Colab]([https://colab.research.google.com/github/MelihCan1115/slm-cti-classification/blob/main/notebooks/LLM_Last_Result.ipynb](https://colab.research.google.com/drive/1SysgLq06HzCUf6xke7KXyBYGOHAlW58t?usp=sharing))
- **Dataset:** [mrmoor/cyber-threat-intelligence on Hugging Face](https://huggingface.co/datasets/mrmoor/cyber-threat-intelligence)
- **Best Fine-Tuned Model:** [MelihCan1115/cti-gemma-2-2b_seed123 on Hugging Face](https://huggingface.co/MelihCan1115/cti-gemma-2-2b_seed123)

---

## Ethical and Academic Disclosure

This project was developed for academic purposes as part of the **Büyük Dil Modelleri (BDM)** course final project. All experiments were conducted on publicly available datasets and open-source models. No private or sensitive data was used. The results are reported transparently including failures and limitations.

---

## Contact Information

- **GitHub:** [github.com/MelihCan1115](https://github.com/MelihCan1115)
- **Hugging Face:** [huggingface.co/MelihCan1115](https://huggingface.co/MelihCan1115)
- **Student ID:** 258273001026

---

## Keywords

Small Language Models, SLM, QLoRA, Parameter-Efficient Fine-Tuning, PEFT, Cyber Threat Intelligence, CTI, Text Classification, STIX 2.1, NER, Gemma, Qwen, TinyLlama, SmolLM2, Natural Language Processing, NLP, Cybersecurity, Büyük Dil Modelleri

---
---

Türkçe [TR]

---

# Siber Tehdit İstihbaratı Sınıflandırması için SLM İnce Ayarı

---

## Özet

Bu proje, Siber Tehdit İstihbaratı (CTI) metin sınıflandırma görevi için 4-bit Nicelleştirilmiş Düşük Sıralı Uyarlama (QLoRA) yöntemi kullanılarak ince ayar yapılmış dört Küçük Dil Modelinin (SLM) karşılaştırmalı çalışmasını sunmaktadır. `mrmoor/cyber-threat-intelligence` veri kümesi (9.732 örnek, 17 etiket sınıfı) birincil eğitim verisi olarak kullanılmıştır. İstatistiksel güvenilirlik için her model **3 farklı rastgele çekirdek değeri (42, 123, 456)** üzerinde eğitilmiştir. Sonuçlar, **Gemma-2-2b** modelinin en yüksek doğruluğa (%70,12 ± 0,44) ulaştığını, **Qwen2.5-1.5B** modelinin ise en iyi doğruluk/boyut dengesini sunduğunu göstermektedir.

---

## Amaç

Bu projenin amacı QLoRA aracılığıyla parametre verimli ince ayarın (PEFT), küçük açık kaynaklı dil modellerini özelleşmiş bir siber güvenlik sınıflandırma görevine etkin biçimde uyarlayıp uyarlayamayacağını değerlendirmektir. Çalışma şu konuları araştırmaktadır:

- Model parametre sayısı ile sınıflandırma doğruluğu arasındaki ilişki
- Model boyutu, eğitim süresi ve çıkarım hızı arasındaki denge
- İnce ayarlı modellerin çeşitli CTI varlık türlerini sınıflandırma kapasitesi
- Standartlaştırılmış test örnekleri kullanılarak modeller arası hata örüntülerinin karşılaştırması

---

## Metodoloji

### Modeller

Dört SLM, farklı parametre boyutlarını kapsayacak şekilde seçilmiştir:

| Model | Parametre Sayısı | Temel Model |
|---|---|---|
| SmolLM2-360M | 205M | HuggingFaceTB/SmolLM2-360M |
| TinyLlama-1.1B | 551M | TinyLlama/TinyLlama-1.1B-Chat-v1.0 |
| Qwen2.5-1.5B | 889M | Qwen/Qwen2.5-1.5B |
| Gemma-2-2b | 1603M | google/gemma-2-2b-it |

### İnce Ayar Yöntemi

Tüm modeller **4-bit NF4 QLoRA** yöntemi (Dettmers ve ark., 2023) kullanılarak ince ayar yapılmıştır:

- LoRA sırası: **r = 8**, alpha = 16, dropout = 0.1
- Hedef modüller: tüm doğrusal katmanlar
- Kaydedilen modüller: `score` (sınıflandırma başlığı)
- Niceleme: BitsAndBytes 4-bit NF4, hesaplama türü bfloat16

### Eğitim Yapılandırması

| Hiperparametre | Değer |
|---|---|
| Epoch Sayısı | 3 |
| Öğrenme Oranı | 2e-4 |
| Eğitim Parti Boyutu | 16 |
| Değerlendirme Parti Boyutu | 32 |
| Isınma Oranı | 0.1 |
| Ağırlık Düşümü | 0.01 |
| En İyi Model Ölçütü | macro_f1 |
| Karma Hassasiyet | fp16 |
| Maksimum Token Uzunluğu | 128 |
| Donanım | NVIDIA Tesla T4 (15,6 GB VRAM) |

### Kullanılan Çekirdek Değerleri

```python
SEEDS = [42, 123, 456]
```

### Veri Kümesi

```python
from datasets import load_dataset
dataset = load_dataset('mrmoor/cyber-threat-intelligence')
# Toplam: 9.732 örnek  |  Eğitim: 6.556  |  Doğrulama: 819  |  Test: 820
# Sınıf sayısı: 17 (en az 20 örnekli sınıflar dahil edilmiştir)
```

**Etiket Sınıfları (17 toplam):**

STIX 2.1 Ontolojisi (8): `attack-pattern`, `campaign`, `identity`, `location`, `malware`, `threat-actor`, `tools`, `vulnerability`

NER Varlık Türleri (9): `DOMAIN`, `FILEPATH`, `IPV4`, `O`, `SHA1`, `SHA2`, `SOFTWARE`, `TIME`, `URL`

---

## Önemli Bulgular

### 1. Sınıflandırma Performansı

İnce ayar, tüm modellerde sıfır-atış (zero-shot) referans değerlerine kıyasla doğruluğu önemli ölçüde artırmıştır:

| Model | Sıfır-Atış Doğruluğu | İnce Ayar Doğruluğu | Kazanım |
|---|---|---|---|
| SmolLM2-360M | %3,5 | %45,45 ± 2,95 | +41,9 pp |
| TinyLlama-1.1B | %0,0 | %67,52 ± 0,79 | +67,5 pp |
| Qwen2.5-1.5B | %31,0 | %68,66 ± 1,85 | +37,7 pp |
| Gemma-2-2b | %35,5 | **%70,12 ± 0,44** | +34,6 pp |

### 2. Model Boyutu ile Performans Dengesi

| Model | Boyut | Doğruluk | Çıkarım Hızı |
|---|---|---|---|
| SmolLM2-360M | 350 MB | %45,45 | 11,7 ms/örnek |
| TinyLlama-1.1B | 752 MB | %67,52 | 22,6 ms/örnek |
| Qwen2.5-1.5B | 1.594 MB | %68,66 | 28,5 ms/örnek |
| Gemma-2-2b | 3.379 MB | %70,12 | 41,0 ms/örnek |

### 3. Eğitim Verimliliği

| Model | Eğitim Süresi (çekirdek başına) | GPU Belleği |
|---|---|---|
| SmolLM2-360M | 14,1 dk | Ort. 3.198 MB |
| TinyLlama-1.1B | 25,9 dk | Ort. 3.262 MB |
| Qwen2.5-1.5B | 33,2 dk | Ort. 4.910 MB |
| Gemma-2-2b | 48,4 dk | Ort. 8.430 MB |

### 4. Hata Analizi (5 Standartlaştırılmış Test)

Beş standartlaştırılmış metin, tüm ince ayarlı modellere (çekirdek=42) uygulanmıştır:

| Test | Beklenen | SmolLM2 | TinyLlama | Qwen2.5 | Gemma-2 |
|---|---|---|---|---|---|
| Fidye yazılımı metni | `malware` | `O` ✗ | `malware` ✓ | `O` ✗ (%85,9) | `SOFTWARE` ✗ |
| Kimlik avı metni | `attack-pattern` | `O` ✗ | ✓ | ✓ | ✓ |
| CVE metni | `vulnerability` | `O` ✗ | ✓ | ✓ | ✓ (%98) |
| Tehdit aktörü | `threat-actor` | `location` ✗ | `location` ✗ | ✓ (%94,1) | ✓ |
| C2 URL metni | `URL` | `O` ✗ | `O` ✗ | `O` ✗ | ✓ (%79,3) |
| **Skor** | | **0/5** | **3/5** | **3/5** | **4/5** |

---

## Sonuç Özeti Tablosu

| Model | Parametre | İnce Ayar | Doğruluk | Makro-F1 | Eğitim Süresi | Çıkarım | Boyut |
|---|---|---|---|---|---|---|---|
| SmolLM2-360M | 205M | QLoRA | 0,4545 ± 0,0295 | 0,0601 ± 0,0180 | 14,1 dk | 11,7 ms | 350 MB |
| TinyLlama-1.1B | 551M | QLoRA | 0,6752 ± 0,0079 | 0,4381 ± 0,0343 | 25,9 dk | 22,6 ms | 752 MB |
| Qwen2.5-1.5B | 889M | QLoRA | 0,6866 ± 0,0185 | 0,4724 ± 0,0195 | 33,2 dk | 28,5 ms | 1.594 MB |
| **Gemma-2-2b** | **1.603M** | **QLoRA** | **0,7012 ± 0,0044** | **0,4798 ± 0,0637** | **48,4 dk** | **41,0 ms** | **3.379 MB** |

Tüm metrikler 3 çekirdek değeri (42, 123, 456) üzerinden ortalaması alınmıştır. Donanım: NVIDIA Tesla T4, Google Colab.

---

## Sonuç

Gemma-2-2b, %70,12 doğruluk ve en düşük çekirdek varyansı (±0,44) ile genel olarak en iyi performansı gösteren modeldir. Qwen2.5-1.5B, en iyi doğruluk/boyut oranını sunmaktadır. SmolLM2-360M, çoğunluk sınıfına (`O`) çökme eğilimi nedeniyle bu 17 sınıflı görev için uygun değildir. Hata analizinin temel bulgusu şudur: Büyük modeller yüksek güvenle yanlış tahmin üretebilmektedir (Qwen: yanlış etikette %85,9 güven), bu durum gerçek bir CTI sisteminde düşük güvenli hatalardan daha tehlikeli olabilir.

---

## Depo Yapısı

```
slm-cti-classification/
├── notebooks/
│   └── LLM_Last_Result.ipynb      # Tam eğitim + değerlendirme hattı
├── results/
│   ├── all_seed_results.json       # Ham çekirdek bazlı metrikler
│   ├── final_results_table.csv     # Toplanmış sonuç tablosu
│   ├── zero_shot_baseline.csv      # Sıfır-atış referans metrikleri
│   └── figures/
│       └── model_comparison.png    # Performans karşılaştırma grafiği
├── README.md
└── requirements.txt
```

---

## Kurulum ve Çalıştırma Adımları

**1. Depoyu klonlayın:**
```bash
git clone https://github.com/MelihCan1115/slm-cti-classification.git
cd slm-cti-classification
```

**2. Bağımlılıkları yükleyin:**
```bash
pip install -r requirements.txt
```

**3. Google Colab üzerinde çalıştırın (önerilen):**

Not defterini doğrudan Google Colab'da açın: [LLM_Last_Result.ipynb — Colab'da Aç]([https://colab.research.google.com/github/MelihCan1115/slm-cti-classification/blob/main/notebooks/LLM_Last_Result.ipynb](https://colab.research.google.com/drive/1SysgLq06HzCUf6xke7KXyBYGOHAlW58t?usp=sharing))

> Donanım gereksinimi: ≥15 GB VRAM'e sahip GPU (Tesla T4 veya daha iyi). 4 model × 3 çekirdek değerinin tamamının eğitilmesi yaklaşık 4–5 saat sürmektedir.

**4. Hugging Face token (yalnızca model yükleme için):**

Colab'da sol kenar çubuğundaki **Gizli Değerler (Secrets)** bölümünü açın ve şunları ekleyin:
- Anahtar: `HF_TOKEN_WRITE`
- Değer: huggingface.co/settings/tokens adresinden aldığınız Yazma (Write) token'ı

---

## Erişim Bağlantıları

- **Google Colab Not Defteri:** [Colab'da Aç]([https://colab.research.google.com/github/MelihCan1115/slm-cti-classification/blob/main/notebooks/LLM_Last_Result.ipynb](https://colab.research.google.com/drive/1SysgLq06HzCUf6xke7KXyBYGOHAlW58t?usp=sharing))
- **Veri Kümesi:** [Hugging Face — mrmoor/cyber-threat-intelligence](https://huggingface.co/datasets/mrmoor/cyber-threat-intelligence)
- **En İyi İnce Ayarlı Model:** [MelihCan1115/cti-gemma-2-2b_seed123](https://huggingface.co/MelihCan1115/cti-gemma-2-2b_seed123)

---

## Etik ve Akademik Açıklama

Bu proje, **Büyük Dil Modelleri (BDM)** dersi final ödevi kapsamında akademik amaçlarla geliştirilmiştir. Tüm deneyler kamuya açık veri kümeleri ve açık kaynaklı modeller üzerinde gerçekleştirilmiştir. Özel veya hassas veri kullanılmamıştır. Sonuçlar, başarısızlıklar ve sınırlılıklar da dahil olmak üzere şeffaf biçimde raporlanmıştır.

---

## İletişim Bilgileri

- **GitHub:** [github.com/MelihCan1115](https://github.com/MelihCan1115)
- **Hugging Face:** [huggingface.co/MelihCan1115](https://huggingface.co/MelihCan1115)
- **Öğrenci No:** 258273001026

---

## Anahtar Kelimeler

Küçük Dil Modelleri, SLM, QLoRA, Parametre Verimli İnce Ayar, PEFT, Siber Tehdit İstihbaratı, CTI, Metin Sınıflandırma, STIX 2.1, NER, Gemma, Qwen, TinyLlama, SmolLM2, Doğal Dil İşleme, NLP, Siber Güvenlik, Büyük Dil Modelleri
